import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { fetchWithRetry, getErrorMessage } from '../utils/fetchWithRetry';

export default function ApplicationForm() {
  const toast = useToast();
  const [searchParams] = useSearchParams();

  // Get tier from URL params (e.g., ?tier=gold or ?tier=suprem&hours=12)
  const initialTier = ['basic', 'gold', 'platinum', 'suprem'].includes(searchParams.get('tier'))
    ? searchParams.get('tier')
    : 'basic';
  const initialHours = searchParams.get('hours') || '1';

  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    revolutId: '',
    motto: '',
    tier: initialTier,
    supremHours: initialHours, // For suprem tier: '1', '12', '24'
    poza: '',
    link: ''
  });

  // Update tier if URL param changes
  useEffect(() => {
    const tierParam = searchParams.get('tier');
    const hoursParam = searchParams.get('hours');
    if (tierParam && ['basic', 'gold', 'platinum', 'suprem'].includes(tierParam)) {
      setFormData(prev => ({
        ...prev,
        tier: tierParam,
        supremHours: hoursParam || prev.supremHours
      }));
    }
  }, [searchParams]);

  const [submitted, setSubmitted] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const tierPrices = {
    basic: '20 RON',
    gold: '50 RON',
    platinum: '100 RON',
    suprem: 'variabil'
  };

  // Calculate Suprem price with discounts
  const calculateSupremPrice = (hours) => {
    const h = parseInt(hours) || 1;
    const basePrice = h * 50;
    let discount = 0;
    if (h >= 24) discount = 20;
    else if (h >= 12) discount = 10;
    return Math.round(basePrice * (1 - discount / 100));
  };

  const getSupremPriceLabel = () => {
    const hours = parseInt(formData.supremHours) || 1;
    const price = calculateSupremPrice(hours);
    return `${price} RON (${hours}h)`;
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

  // Calculate form progress
  const calculateProgress = () => {
    const requiredFields = {
      nume: formData.nume.trim(),
      email: formData.email.trim(),
      revolutId: formData.revolutId.trim(),
      motto: formData.motto.trim(),
      tierSelected: true // tier is always selected (default is basic)
    };

    // Bonus points for optional fields
    const optionalFields = {
      poza: imagePreview || formData.poza,
      link: (formData.tier === 'platinum' || formData.tier === 'suprem') ? formData.link.trim() : null
    };

    const completedRequired = Object.values(requiredFields).filter(Boolean).length;
    const totalRequired = Object.keys(requiredFields).length;

    // Base progress from required fields (80%)
    const baseProgress = (completedRequired / totalRequired) * 80;

    // Bonus progress from optional fields (20%)
    const optionalComplete = Object.values(optionalFields).filter(v => v !== null && v).length;
    const optionalTotal = Object.values(optionalFields).filter(v => v !== null).length || 1;
    const bonusProgress = (optionalComplete / optionalTotal) * 20;

    return Math.round(baseProgress + bonusProgress);
  };

  const progress = calculateProgress();

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl blur-xl opacity-30"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Cerere Înregistrată!</h2>
              <p className="text-sm opacity-90">Salvează codul tău</p>
            </div>

            <div className="p-6">
              {/* Application Code */}
              <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border-2 border-[#D4AF37] rounded-xl p-6 mb-6 text-center">
                <p className="text-xs font-bold text-[#D4AF37] mb-2 uppercase">Codul Tău</p>
                <div className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mb-2 tracking-wider">
                  {applicationCode}
                </div>
                <p className="text-xs text-gray-700">Salvează acest cod pentru plată și email!</p>
              </div>

              {/* Simple Steps */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-[#1a365d] mb-3">Ce urmează:</h3>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span>📱</span> 1. Plată Revolut
                  </p>
                  <p className="text-sm text-gray-700">
                    Trimite <strong>{formData.tier === 'suprem' ? getSupremPriceLabel() : tierPrices[formData.tier]}</strong> la <strong>@username-revolut</strong><br/>
                    Mesaj: <strong>{applicationCode}</strong>
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                  <p className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <span>📧</span> 2. Email cu poza
                  </p>
                  <p className="text-sm text-gray-700">
                    La: <strong>contact@registrulbarosanilor.ro</strong><br/>
                    Subiect: <strong>Cerere Barosan - {applicationCode}</strong>
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <span>⏱️</span> 3. Confirmare în 24h
                  </p>
                  <p className="text-sm text-gray-700">
                    Vei primi certificatul și vei apărea în Registru!
                  </p>
                </div>
              </div>

              {/* Compact Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs font-bold text-gray-600 mb-2">Detalii cerere:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-600">Nume:</span> <strong>{formData.nume}</strong></div>
                  <div><span className="text-gray-600">Tier:</span> <strong className="uppercase">{formData.tier}{formData.tier === 'suprem' ? ` (${formData.supremHours}h)` : ''}</strong></div>
                  <div className="col-span-2"><span className="text-gray-600">Email:</span> <strong className="break-all">{formData.email}</strong></div>
                  <div className="col-span-2"><span className="text-gray-600">Motto:</span> <em>"{formData.motto}"</em></div>
                </div>
              </div>

              <button
                onClick={handleStartNew}
                className="w-full text-center text-[#1a365d] hover:text-[#2d5986] font-semibold text-sm"
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-yellow-500/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60">Progres formular</span>
              <span className="text-xs font-bold text-yellow-400">{progress}%</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              >
              </div>
            </div>
          </div>

        {/* Disclaimer Compact */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <p className="text-xs text-yellow-200">
              <strong>PARODIE / UMOR</strong> - Site de divertisment. Certificatele nu au valoare oficială.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nume */}
          <div>
            <label className="block text-sm font-bold text-white/80 mb-2">
              Nume / Poreclă <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="nume"
              value={formData.nume}
              onChange={handleChange}
              placeholder="Cum vrei să apari în Registru"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-white/40 transition-all ${
                errors.nume ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.nume && <p className="text-red-400 text-sm mt-1">{errors.nume}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-white/80 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplu.ro"
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-white/40 transition-all ${
                errors.email ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Revolut ID */}
          <div>
            <label className="block text-sm font-bold text-white/80 mb-2">
              ID Revolut <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 font-bold">@</span>
              <input
                type="text"
                name="revolutId"
                value={formData.revolutId}
                onChange={handleChange}
                placeholder="username_revolut"
                className={`w-full pl-9 pr-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-white/40 transition-all ${
                  errors.revolutId ? 'border-red-500' : 'border-white/20'
                }`}
              />
            </div>
            {errors.revolutId && <p className="text-red-400 text-sm mt-1">{errors.revolutId}</p>}
          </div>

          {/* Tier */}
          <div>
            <label className="block text-sm font-bold text-white/80 mb-3">
              Alege Tier-ul <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['basic', 'gold', 'platinum', 'suprem'].map((tier) => (
                <label
                  key={tier}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.tier === tier
                      ? tier === 'suprem'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 scale-105'
                        : tier === 'platinum'
                          ? 'border-gray-300 bg-gradient-to-br from-gray-200/20 to-gray-300/20 scale-105'
                          : tier === 'gold'
                            ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 scale-105'
                            : 'border-gray-400 bg-white/10 scale-105'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
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
                    <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                      tier === 'suprem' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                    }`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-2xl mb-1">
                    {tier === 'basic' ? '⭐' : tier === 'gold' ? '🏆' : tier === 'platinum' ? '💎' : '👑'}
                  </span>
                  <span className={`font-bold uppercase text-xs ${
                    formData.tier === tier
                      ? tier === 'suprem' ? 'text-purple-300' : 'text-yellow-400'
                      : 'text-white/70'
                  }`}>{tier}</span>
                  <span className={`text-xs font-semibold ${
                    formData.tier === tier ? 'text-white/80' : 'text-white/50'
                  }`}>
                    {tier === 'suprem' ? 'TEMPORAR' : tierPrices[tier]}
                  </span>
                </label>
              ))}
            </div>

            {/* Suprem Hours Display */}
            {formData.tier === 'suprem' && (
              <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-purple-300">👑 Barosanul Suprem</p>
                    <p className="text-white text-lg font-bold">{formData.supremHours} {parseInt(formData.supremHours) === 1 ? 'oră' : 'ore'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs">Total</p>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {calculateSupremPrice(formData.supremHours)} RON
                    </p>
                  </div>
                </div>
                <p className="text-white/50 text-xs mt-2">
                  Pentru a schimba durata, <a href="#pricing" className="text-purple-400 hover:underline">mergi la selecția pachetului</a>
                </p>
              </div>
            )}
          </div>

          {/* Motto */}
          <div>
            <label className="block text-sm font-bold text-white/80 mb-2">
              Motto Personal <span className="text-red-400">*</span>
              <span className="text-xs text-white/50 ml-2 font-normal">(max 50 caractere)</span>
            </label>
            <input
              type="text"
              name="motto"
              value={formData.motto}
              onChange={handleChange}
              placeholder="Viața e scurtă, fii barosan"
              maxLength={50}
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-white/40 transition-all ${
                errors.motto ? 'border-red-500' : 'border-white/20'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.motto && <p className="text-red-400 text-sm">{errors.motto}</p>}
              <p className={`text-xs ml-auto ${formData.motto.length >= 50 ? 'text-red-400' : 'text-white/50'}`}>
                {formData.motto.length}/50
              </p>
            </div>
          </div>

          {/* Poză Upload */}
          <div>
            <label className="block text-sm font-bold text-white/80 mb-2">
              Poza Ta <span className="text-white/50 text-xs font-normal">(opțional)</span>
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all cursor-pointer">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-2">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-sm font-semibold text-white/80 mb-1">Click pentru a uploada</p>
                  <p className="text-xs text-white/50">JPG, PNG sau WEBP (max 5MB)</p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-yellow-500/50 rounded-xl p-4 bg-yellow-500/10">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-6 right-6 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <span className="text-sm font-bold">✕</span>
                </button>
                <p className="text-xs text-white/70 text-center">
                  {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {errors.poza && <p className="text-red-400 text-sm mt-1">{errors.poza}</p>}
          </div>

          {/* Link (pentru Platinum și Suprem) */}
          {(formData.tier === 'platinum' || formData.tier === 'suprem') && (
            <div>
              <label className="block text-sm font-bold text-white/80 mb-2">
                Link Personal <span className="text-white/50 text-xs font-normal">(opțional)</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-white/40 transition-all ${
                  errors.link ? 'border-red-500' : 'border-white/20'
                }`}
              />
              {errors.link && <p className="text-red-400 text-sm mt-1">{errors.link}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              uploading
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/20'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </span>
            ) : (
              'Generează Cod 🎯'
            )}
          </button>

          <p className="text-xs text-white/50 text-center bg-white/5 rounded-lg p-3 border border-white/10">
            După trimitere vei primi un cod unic pentru plată și email.
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
