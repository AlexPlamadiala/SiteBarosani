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
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 md:p-8 text-white text-center">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Cerere Înregistrată!</h2>
            <p className="text-base md:text-lg opacity-90">Codul tău de cerere a fost generat</p>
          </div>

          {/* Application Code Display */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="bg-[#D4AF37] bg-opacity-20 border-4 border-[#D4AF37] rounded-lg p-4 sm:p-6 md:p-8 mb-6 md:mb-8 text-center">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">CODUL TĂU DE CERERE</p>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a365d] mb-3 md:mb-4 tracking-wider break-all">
                {applicationCode}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Salvează acest cod! Vei avea nevoie de el pentru plată și email.</p>
            </div>

            {/* Instructions */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#1a365d]">Pașii Următori:</h3>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4">
                <h4 className="font-bold text-blue-900 mb-2 text-sm md:text-base">📱 Pasul 1: Plata prin Revolut</h4>
                <ul className="text-xs md:text-sm space-y-1 ml-4">
                  <li className="break-words">• Trimite <strong>{tierPrices[formData.tier]}</strong> la: <strong>@username-revolut</strong></li>
                  <li className="break-words">• Folosește ID-ul tău Revolut: <strong className="text-blue-700">@{formData.revolutId}</strong></li>
                  <li className="break-words">• În mesajul plății scrie: <strong className="text-blue-700">{applicationCode}</strong></li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 md:p-4">
                <h4 className="font-bold text-purple-900 mb-2 text-sm md:text-base">📧 Pasul 2: Trimite Email-ul</h4>
                <ul className="text-xs md:text-sm space-y-1 ml-4">
                  <li className="break-words">• Email: <strong>contact@zidulbarosanilor.ro</strong></li>
                  <li className="break-words">• Subiect: <strong className="text-purple-700">Cerere Barosan - {applicationCode}</strong></li>
                  <li>• Atașează poza ta (JPG/PNG, min 400x400px)</li>
                  <li className="break-words">• Menționează codul <strong className="text-purple-700">{applicationCode}</strong> în email</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4">
                <h4 className="font-bold text-green-900 mb-2 text-sm md:text-base">⏱️ Pasul 3: Așteaptă Confirmarea</h4>
                <p className="text-xs md:text-sm">În maxim <strong>24 de ore</strong> de la confirmarea plății și primirea email-ului, vei apărea pe Zidul Barosanilor și vei primi certificatul pe email!</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 md:p-4">
                <h4 className="font-bold text-yellow-900 mb-2 text-sm md:text-base">⚠️ IMPORTANT</h4>
                <p className="text-xs md:text-sm break-words">Codul <strong>{applicationCode}</strong> ajută administratorul să asocieze plata ta cu cererea și email-ul. <strong>Nu uita să-l incluzi în ambele locuri!</strong></p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Rezumat Cerere:</h4>
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 bg-blue-100 p-2 md:p-3 rounded break-words">
                <strong>Chei de control:</strong> Cod Cerere ({applicationCode}) + Revolut ID (@{formData.revolutId}) + Email ({formData.email})
              </p>
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
                className="text-[#1a365d] hover:underline font-semibold"
              >
                ← Înapoi la formular
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-2 text-center">
          Formular de Înscriere Barosan
        </h2>
        <p className="text-sm md:text-base text-gray-600 text-center mb-4 md:mb-6">
          Completează datele și primești un cod unic pentru a finaliza procesul
        </p>

        {/* Disclaimer - Umor */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-start gap-2 md:gap-3">
            <span className="text-xl md:text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-yellow-900 mb-1 text-sm md:text-base">ATENȚIE - Site de Parodie / Umor</p>
              <p className="text-xs md:text-sm text-yellow-800">
                Acest site este creat exclusiv pentru <strong>amuzament și divertisment</strong>.
                Certificatele și titlurile nu au valoare oficială, juridică sau de certificare reală.
                Prin continuarea înregistrării, confirmi că înțelegi natura umoristică a serviciului.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nume */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nume / Poreclă <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              placeholder="Cum vrei să apari pe Zid"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                errors.nume ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nume && <p className="text-red-500 text-sm mt-1">{errors.nume}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplu.ro"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Revolut ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ID Revolut <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">@</span>
              <input
                type="text"
                name="revolutId"
                value={formData.revolutId}
                onChange={handleChange}
                placeholder="username_revolut"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.revolutId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.revolutId && <p className="text-red-500 text-sm mt-1">{errors.revolutId}</p>}
            <p className="text-xs text-gray-500 mt-1">
              ID-ul tău Revolut (ex: @ion_barosan). Va fi folosit pentru a identifica plata ta.
            </p>
          </div>

          {/* Tier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alege Tier-ul <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {['basic', 'gold', 'platinum'].map((tier) => (
                <label
                  key={tier}
                  className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all touch-manipulation active:scale-95 ${
                    formData.tier === tier
                      ? 'border-[#D4AF37] bg-[#D4AF37] bg-opacity-10'
                      : 'border-gray-300 hover:border-[#D4AF37]'
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
                  <span className="text-3xl md:text-2xl mb-2">
                    {tier === 'basic' ? '⭐' : tier === 'gold' ? '🏆' : '💎'}
                  </span>
                  <span className="font-bold uppercase text-sm md:text-sm">{tier}</span>
                  <span className="text-xs text-gray-600 mt-1">{tierPrices[tier]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Motto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motto Personal <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(max 50 caractere)</span>
            </label>
            <input
              type="text"
              name="motto"
              value={formData.motto}
              onChange={handleChange}
              placeholder="De exemplu: Viața e scurtă, fii barosan"
              maxLength={50}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                errors.motto ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.motto && <p className="text-red-500 text-sm">{errors.motto}</p>}
              <p className="text-xs text-gray-500 ml-auto">{formData.motto.length}/50</p>
            </div>
          </div>

          {/* Poză Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poza Ta <span className="text-gray-500 text-xs">(opțional)</span>
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600 mb-1">Click pentru a uploada o imagine</p>
                  <p className="text-xs text-gray-500">JPG, PNG sau WEBP (max 5MB)</p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-[#D4AF37] rounded-lg p-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
                <p className="text-xs text-gray-600 text-center">
                  {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {errors.poza && <p className="text-red-500 text-sm mt-1">{errors.poza}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Imaginea va fi redimensionată automat la 800x800px. Sau poți lăsa gol și trimite pe email după.
            </p>
          </div>

          {/* Link (doar pentru Platinum) */}
          {formData.tier === 'platinum' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link Personal (Instagram/TikTok) <span className="text-gray-500 text-xs">(opțional)</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://instagram.com/username (opțional)"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.link ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Link-ul tău personal va apărea pe cardul tău de pe Zidul Barosanilor.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all touch-manipulation min-h-[44px] ${
              uploading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#c19b2e] text-[#1a365d] hover:shadow-lg active:scale-95'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading imagine...
              </span>
            ) : (
              'Generează Cod de Cerere 🎯'
            )}
          </button>

          <p className="text-xs md:text-sm text-gray-500 text-center">
            După trimiterea formularului vei primi un cod unic pe care trebuie să-l folosești pentru plată și email.
          </p>
        </form>
      </div>
    </div>
  );
}
