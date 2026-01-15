import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { fetchWithRetry, getErrorMessage } from '../utils/fetchWithRetry';

export default function ApplicationForm() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    revolutId: '',
    motto: '',
    tier: 'basic',
    poza: '',
    link: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const tierPrices = {
    basic: '20 RON',
    gold: '50 RON',
    platinum: '100 RON'
  };

  const generateApplicationCode = () => {
    const year = new Date().getFullYear();
    const existingApps = JSON.parse(localStorage.getItem('barosaniApplications') || '[]');
    const nextNumber = existingApps.length + 1;
    return `CP-${year}-${String(nextNumber).padStart(4, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nume.trim()) {
      newErrors.nume = 'Numele este obligatoriu';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid';
    }

    if (!formData.revolutId.trim()) {
      newErrors.revolutId = 'ID-ul Revolut este obligatoriu';
    } else if (formData.revolutId.trim().length < 3) {
      newErrors.revolutId = 'ID-ul Revolut pare prea scurt';
    }

    if (!formData.motto.trim()) {
      newErrors.motto = 'Motto-ul este obligatoriu';
    } else if (formData.motto.length > 50) {
      newErrors.motto = 'Motto-ul trebuie să aibă maximum 50 de caractere';
    }

    // Poza și link-ul sunt opționale

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);
    let uploadedImageUrl = formData.poza;

    try {
      // Upload imagine dacă există
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await fetchWithRetry(
          'http://localhost/SiteBarosani/api/upload_image.php',
          {
            method: 'POST',
            body: imageFormData
          },
          3,
          1000,
          (attempt, maxRetries) => {
            toast.info(`Reîncerc uploadarea imaginii... (${attempt}/${maxRetries})`, 2000);
          }
        );

        const uploadData = await uploadResponse.json();

        if (uploadData.success) {
          uploadedImageUrl = uploadData.url;
          toast.success('Imagine uploadată cu succes!');
        } else {
          toast.error('Eroare la uploadarea imaginii: ' + uploadData.error);
          setUploading(false);
          return;
        }
      }

      // Trimite cererea la API
      const response = await fetchWithRetry(
        'http://localhost/SiteBarosani/api/applications.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nume: formData.nume,
            email: formData.email,
            revolutId: formData.revolutId,
            motto: formData.motto,
            tier: formData.tier,
            poza: uploadedImageUrl,
            link: formData.link
          })
        },
        3,
        1000,
        (attempt, maxRetries) => {
          toast.info(`Reîncerc trimiterea cererii... (${attempt}/${maxRetries})`, 2000);
        }
      );

      const data = await response.json();

      if (data.success) {
        setApplicationCode(data.code);
        setSubmitted(true);
        toast.success('Cerere trimisă cu succes! Codul tău: ' + data.code);

        // Backup în localStorage (opțional)
        const existingApps = JSON.parse(localStorage.getItem('barosaniApplications') || '[]');
        existingApps.push({
          ...formData,
          poza: uploadedImageUrl,
          code: data.code,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('barosaniApplications', JSON.stringify(existingApps));
      } else {
        toast.error('Eroare la trimiterea cererii: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({ ...prev, poza: 'Doar fișiere JPG, PNG sau WEBP sunt permise' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, poza: 'Imaginea este prea mare (max 5MB)' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, poza: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, poza: '' }));
  };

  const handleStartNew = () => {
    setFormData({
      nume: '',
      email: '',
      revolutId: '',
      motto: '',
      tier: 'basic',
      poza: '',
      link: ''
    });
    setSubmitted(false);
    setApplicationCode('');
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Success Header - Enhanced */}
            <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-500 p-6 md:p-8 text-white text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 shadow-xl backdrop-blur-sm">
                  <span className="text-5xl md:text-6xl">✅</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">Cerere Înregistrată!</h2>
                <p className="text-base md:text-lg opacity-95">Codul tău de cerere a fost generat</p>
              </div>
            </div>

          {/* Application Code Display */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="relative group/code">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-xl blur opacity-30 group-hover/code:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border-4 border-[#D4AF37] rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 text-center shadow-lg">
                <p className="text-xs sm:text-sm font-extrabold text-[#D4AF37] mb-3 uppercase tracking-wide">Codul Tău de Cerere</p>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-white rounded-lg blur opacity-75"></div>
                  <div className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a365d] mb-3 md:mb-4 tracking-wider break-all bg-white px-6 py-3 rounded-lg shadow-md">
                    {applicationCode}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-semibold">Salvează acest cod! Vei avea nevoie de el pentru plată și email.</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#1a365d]">Pașii Următori:</h3>

              <div className="relative group/step">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-10 group-hover/step:opacity-20 transition-opacity"></div>
                <div className="relative bg-blue-50 border-l-4 border-blue-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <h4 className="font-extrabold text-blue-900 mb-3 text-base md:text-lg flex items-center gap-2">
                    <span className="text-xl">📱</span> Pasul 1: Plata prin Revolut
                  </h4>
                  <ul className="text-sm md:text-base space-y-2 ml-4">
                    <li className="break-words flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>Trimite <strong className="text-blue-700">{tierPrices[formData.tier]}</strong> la: <strong className="text-blue-700">@username-revolut</strong></span>
                    </li>
                    <li className="break-words flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>Folosește ID-ul tău Revolut: <strong className="text-blue-700">@{formData.revolutId}</strong></span>
                    </li>
                    <li className="break-words flex items-start gap-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>În mesajul plății scrie: <strong className="text-blue-700">{applicationCode}</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group/step">
                <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-10 group-hover/step:opacity-20 transition-opacity"></div>
                <div className="relative bg-purple-50 border-l-4 border-purple-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <h4 className="font-extrabold text-purple-900 mb-3 text-base md:text-lg flex items-center gap-2">
                    <span className="text-xl">📧</span> Pasul 2: Trimite Email-ul
                  </h4>
                  <ul className="text-sm md:text-base space-y-2 ml-4">
                    <li className="break-words flex items-start gap-2">
                      <span className="text-purple-600 mt-1">▸</span>
                      <span>Email: <strong className="text-purple-700">contact@registrulbarosanilor.ro</strong></span>
                    </li>
                    <li className="break-words flex items-start gap-2">
                      <span className="text-purple-600 mt-1">▸</span>
                      <span>Subiect: <strong className="text-purple-700">Cerere Barosan - {applicationCode}</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">▸</span>
                      <span>Atașează poza ta (JPG/PNG, min 400x400px)</span>
                    </li>
                    <li className="break-words flex items-start gap-2">
                      <span className="text-purple-600 mt-1">▸</span>
                      <span>Menționează codul <strong className="text-purple-700">{applicationCode}</strong> în email</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group/step">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-10 group-hover/step:opacity-20 transition-opacity"></div>
                <div className="relative bg-green-50 border-l-4 border-green-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <h4 className="font-extrabold text-green-900 mb-3 text-base md:text-lg flex items-center gap-2">
                    <span className="text-xl">⏱️</span> Pasul 3: Așteaptă Confirmarea
                  </h4>
                  <p className="text-sm md:text-base text-gray-700">
                    În maxim <strong className="text-green-700">24 de ore</strong> de la confirmarea plății și primirea email-ului, vei apărea în <strong>Registrul Oficial al Barosanilor</strong> și vei primi certificatul pe email!
                  </p>
                </div>
              </div>

              <div className="relative group/step">
                <div className="absolute inset-0 bg-yellow-500 rounded-xl blur opacity-10 group-hover/step:opacity-20 transition-opacity"></div>
                <div className="relative bg-yellow-50 border-l-4 border-yellow-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <h4 className="font-extrabold text-yellow-900 mb-3 text-base md:text-lg flex items-center gap-2">
                    <span className="text-xl">⚠️</span> IMPORTANT
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 break-words">
                    Codul <strong className="text-yellow-700">{applicationCode}</strong> ajută administratorul să asocieze plata ta cu cererea și email-ul. <strong>Nu uita să-l incluzi în ambele locuri!</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Summary - Enhanced */}
            <div className="relative mt-6 md:mt-8 group/summary">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] to-[#2d5986] rounded-xl blur opacity-10 group-hover/summary:opacity-20 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200">
                <h4 className="font-extrabold text-[#1a365d] mb-4 text-lg md:text-xl flex items-center gap-2">
                  <span className="text-2xl">📋</span> Rezumat Cerere
                </h4>
                <div className="bg-blue-100 border-l-4 border-blue-500 p-3 md:p-4 rounded-lg mb-4 md:mb-5 shadow-sm">
                  <p className="text-sm md:text-base text-gray-700 break-words">
                    <strong className="text-blue-900">Chei de control:</strong> Cod Cerere (<strong className="text-blue-700">{applicationCode}</strong>) + Revolut ID (<strong className="text-blue-700">@{formData.revolutId}</strong>) + Email (<strong className="text-blue-700">{formData.email}</strong>)
                  </p>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-600">Nume:</p>
                  <p className="font-semibold break-words">{formData.nume}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-semibold break-words">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Revolut ID:</p>
                  <p className="font-semibold break-words">@{formData.revolutId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tier:</p>
                  <p className="font-semibold uppercase">{formData.tier}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sumă:</p>
                  <p className="font-semibold">{tierPrices[formData.tier]}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600">Motto:</p>
                  <p className="font-semibold italic break-words">"{formData.motto}"</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleStartNew}
                className="group relative inline-flex items-center gap-2 text-[#1a365d] hover:text-[#2d5986] font-bold transition-colors"
              >
                <span className="text-lg group-hover:translate-x-[-4px] transition-transform">←</span>
                <span className="group-hover:underline">Înapoi la formular</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] to-[#2d5986] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-100">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl">
              <span className="text-3xl">📝</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-2">
              Formular de Înscriere Barosan
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Completează datele și primești un cod unic pentru a finaliza procesul
            </p>
          </div>

        {/* Disclaimer - Enhanced */}
        <div className="relative group/disclaimer mb-6 md:mb-8">
          <div className="absolute inset-0 bg-yellow-500 rounded-xl blur opacity-20 group-hover/disclaimer:opacity-30 transition-opacity"></div>
          <div className="relative bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="font-extrabold text-yellow-900 mb-2 text-base md:text-lg">ATENȚIE - Site de Parodie / Umor</p>
                <p className="text-sm md:text-base text-yellow-800 leading-relaxed">
                  Acest site este creat exclusiv pentru <strong>amuzament și divertisment</strong>.
                  Certificatele și titlurile nu au valoare oficială, juridică sau de certificare reală.
                  Prin continuarea înregistrării, confirmi că înțelegi natura umoristică a serviciului.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nume */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nume / Poreclă <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              placeholder="Cum vrei să apari în Registru"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-sm ${
                errors.nume ? 'border-red-500' : 'border-gray-300 group-hover/field:border-gray-400'
              }`}
            />
            {errors.nume && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.nume}</p>}
          </div>

          {/* Email */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplu.ro"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300 group-hover/field:border-gray-400'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.email}</p>}
          </div>

          {/* Revolut ID */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ID Revolut <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] font-bold text-lg">@</span>
              <input
                type="text"
                name="revolutId"
                value={formData.revolutId}
                onChange={handleChange}
                placeholder="username_revolut"
                className={`w-full pl-9 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-sm ${
                  errors.revolutId ? 'border-red-500' : 'border-gray-300 group-hover/field:border-gray-400'
                }`}
              />
            </div>
            {errors.revolutId && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.revolutId}</p>}
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              ID-ul tău Revolut (ex: @ion_barosan). Va fi folosit pentru a identifica plata ta.
            </p>
          </div>

          {/* Tier - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Alege Tier-ul <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {['basic', 'gold', 'platinum'].map((tier) => (
                <label
                  key={tier}
                  className={`group/tier relative flex flex-col items-center p-5 border-2 rounded-xl cursor-pointer transition-all touch-manipulation shadow-sm ${
                    formData.tier === tier
                      ? 'border-[#D4AF37] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] scale-105'
                      : 'border-gray-300 hover:border-[#D4AF37] hover:shadow-md active:scale-95'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier}
                    checked={formData.tier === tier}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {formData.tier === tier && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-4xl mb-3">
                    {tier === 'basic' ? '⭐' : tier === 'gold' ? '🏆' : '💎'}
                  </span>
                  <span className="font-extrabold uppercase text-base text-[#1a365d] mb-1">{tier}</span>
                  <span className="text-sm font-bold text-gray-600">{tierPrices[tier]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Motto */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Motto Personal <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2 font-normal">(max 50 caractere)</span>
            </label>
            <input
              type="text"
              name="motto"
              value={formData.motto}
              onChange={handleChange}
              placeholder="De exemplu: Viața e scurtă, fii barosan"
              maxLength={50}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-sm ${
                errors.motto ? 'border-red-500' : 'border-gray-300 group-hover/field:border-gray-400'
              }`}
            />
            <div className="flex justify-between mt-2">
              {errors.motto && <p className="text-red-500 text-sm font-semibold">{errors.motto}</p>}
              <p className={`text-xs ml-auto font-semibold ${formData.motto.length >= 50 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.motto.length}/50
              </p>
            </div>
          </div>

          {/* Poză Upload - Enhanced */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Poza Ta <span className="text-gray-500 text-xs font-normal">(opțional)</span>
            </label>

            {!imagePreview ? (
              <div className="group/upload border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#D4AF37] hover:bg-[#FFF9E6]/30 transition-all cursor-pointer">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 group-hover/upload:bg-[#D4AF37]/20 rounded-full mb-3 transition-colors">
                    <span className="text-4xl">📸</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Click pentru a uploada o imagine</p>
                  <p className="text-xs text-gray-500">JPG, PNG sau WEBP (max 5MB)</p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-[#D4AF37] rounded-xl p-4 bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] shadow-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-3 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-6 right-6 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg hover:scale-110"
                >
                  <span className="text-lg font-bold">✕</span>
                </button>
                <p className="text-xs text-gray-700 text-center font-semibold">
                  {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {errors.poza && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.poza}</p>}
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Imaginea va fi redimensionată automat la 800x800px. Sau poți lăsa gol și trimite pe email după.
            </p>
          </div>

          {/* Link (doar pentru Platinum) - Enhanced */}
          {formData.tier === 'platinum' && (
            <div className="group/field">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Link Personal (Instagram/TikTok) <span className="text-gray-500 text-xs font-normal">(opțional)</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://instagram.com/username (opțional)"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-sm ${
                  errors.link ? 'border-red-500' : 'border-gray-300 group-hover/field:border-gray-400'
                }`}
              />
              {errors.link && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.link}</p>}
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Link-ul tău personal va apărea pe cardul tău din Registrul Oficial al Barosanilor.
              </p>
            </div>
          )}

          {/* Submit Button - Enhanced */}
          <div className="relative group/submit pt-4">
            {!uploading && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-xl blur opacity-30 group-hover/submit:opacity-50 transition-opacity"></div>
            )}
            <button
              type="submit"
              disabled={uploading}
              className={`relative w-full py-4 md:py-5 rounded-xl font-extrabold text-base md:text-lg transition-all touch-manipulation min-h-[56px] shadow-xl ${
                uploading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1a365d] hover:scale-105 active:scale-95'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading imagine...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Generează Cod de Cerere 🎯
                </span>
              )}
            </button>
          </div>

          <p className="text-xs md:text-sm text-gray-600 text-center leading-relaxed bg-gray-50 rounded-lg p-3 md:p-4">
            După trimiterea formularului vei primi un cod unic pe care trebuie să-l folosești pentru plată și email.
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
