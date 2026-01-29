import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { fetchWithRetry, getErrorMessage } from '../utils/fetchWithRetry';
import { UPLOAD_IMAGE_URL, APPLICATIONS_URL } from '../config/api';

export default function ApplicationForm() {
  const toast = useToast();
  const [searchParams] = useSearchParams();

  // Get tier from URL params (e.g., ?tier=gold or ?tier=suprem&hours=12)
  const initialTier = ['basic', 'gold', 'platinum', 'suprem'].includes(searchParams.get('tier'))
    ? searchParams.get('tier')
    : 'basic';
  const initialHours = searchParams.get('hours') || '1';

  // Upgrade mode params
  const isUpgradeMode = searchParams.get('upgrade') === 'true';
  const existingBarosanId = searchParams.get('barosanId');
  const existingEmail = searchParams.get('email');
  const currentTier = searchParams.get('currentTier') || 'basic';

  const [formData, setFormData] = useState({
    nume: '',
    email: existingEmail || '',
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
    const emailParam = searchParams.get('email');
    if (tierParam && ['basic', 'gold', 'platinum', 'suprem'].includes(tierParam)) {
      setFormData(prev => ({
        ...prev,
        tier: tierParam,
        supremHours: hoursParam || prev.supremHours,
        email: emailParam || prev.email
      }));
    }
  }, [searchParams]);

  // Tier order for upgrade validation
  const tierOrder = { basic: 1, gold: 2, platinum: 3, suprem: 4 };
  const canSelectTier = (tier) => {
    if (!isUpgradeMode) return true;
    return tierOrder[tier] > tierOrder[currentTier];
  };

  // Calculate upgrade price (difference)
  const tierPricesNumeric = { basic: 0, gold: 49, platinum: 149 };
  const getUpgradePrice = (newTier) => {
    if (!isUpgradeMode) return tierPricesNumeric[newTier] || 0;
    const currentPrice = tierPricesNumeric[currentTier] || 0;
    const newPrice = tierPricesNumeric[newTier] || 0;
    return Math.max(0, newPrice - currentPrice);
  };

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

  const validateForm = () => {
    const newErrors = {};

    // Validate name - allow any characters
    const trimmedName = formData.nume.trim();
    if (!trimmedName) {
      newErrors.nume = 'Numele este obligatoriu';
    } else if (trimmedName.length < 2) {
      newErrors.nume = 'Numele trebuie să aibă minim 2 caractere';
    } else if (trimmedName.length > 50) {
      newErrors.nume = 'Numele trebuie să aibă maximum 50 de caractere';
    }

    // Validate email with proper regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email-ul nu este valid';
    } else if (formData.email.trim().length > 100) {
      newErrors.email = 'Email-ul este prea lung';
    }

    // Validate Revolut ID
    const trimmedRevolutId = formData.revolutId.trim();
    if (!trimmedRevolutId) {
      newErrors.revolutId = 'ID-ul Revolut este obligatoriu';
    } else if (trimmedRevolutId.length < 3) {
      newErrors.revolutId = 'ID-ul Revolut pare prea scurt';
    } else if (trimmedRevolutId.length > 30) {
      newErrors.revolutId = 'ID-ul Revolut este prea lung';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedRevolutId)) {
      newErrors.revolutId = 'ID-ul Revolut conține caractere invalide';
    }

    // Validate motto
    const trimmedMotto = formData.motto.trim();
    if (!trimmedMotto) {
      newErrors.motto = 'Motto-ul este obligatoriu';
    } else if (trimmedMotto.length < 3) {
      newErrors.motto = 'Motto-ul trebuie să aibă minim 3 caractere';
    } else if (formData.motto.length > 50) {
      newErrors.motto = 'Motto-ul trebuie să aibă maximum 50 de caractere';
    }

    // Validate link (if provided for platinum/suprem)
    if ((formData.tier === 'platinum' || formData.tier === 'suprem') && formData.link.trim()) {
      const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
      if (!urlRegex.test(formData.link.trim())) {
        newErrors.link = 'Link-ul nu este valid (trebuie să înceapă cu http:// sau https://)';
      }
    }

    // Validate suprem hours
    if (formData.tier === 'suprem') {
      const hours = parseInt(formData.supremHours);
      if (isNaN(hours) || hours < 1 || hours > 168) {
        newErrors.supremHours = 'Numărul de ore trebuie să fie între 1 și 168';
      }
    }

    setErrors(newErrors);

    // If there are errors, scroll to the first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }

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
          UPLOAD_IMAGE_URL,
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
        APPLICATIONS_URL,
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
            supremHours: formData.tier === 'suprem' ? parseInt(formData.supremHours) || 1 : null,
            poza: uploadedImageUrl,
            link: formData.link,
            // Upgrade info
            isUpgrade: isUpgradeMode,
            existingBarosanId: isUpgradeMode ? existingBarosanId : null,
            previousTier: isUpgradeMode ? currentTier : null
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

        // Scroll to the form section to show the code
        setTimeout(() => {
          const formSection = document.getElementById('application-form');
          if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);

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
    // Reset file input
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) fileInput.value = '';
  };

  // Cancel / Reset form
  const handleCancel = () => {
    if (formData.nume || formData.email || formData.motto || imagePreview) {
      if (!confirm('Ești sigur că vrei să anulezi? Toate datele introduse vor fi șterse.')) {
        return;
      }
    }
    // Reset all form data
    setFormData({
      nume: '',
      email: existingEmail || '',
      revolutId: '',
      motto: '',
      tier: initialTier,
      supremHours: initialHours,
      poza: '',
      link: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    // Reset file input
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) fileInput.value = '';
    toast.info('Formularul a fost resetat');
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
              {/* Warning - Don't leave page */}
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-4 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-red-700 font-bold text-sm">ATENȚIE! NU ÎNCHIDE PAGINA!</p>
                    <p className="text-red-600 text-xs">Copiază codul de mai jos înainte de a pleca de pe această pagină!</p>
                  </div>
                </div>
              </div>

              {/* Application Code */}
              <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border-2 border-[#D4AF37] rounded-xl p-6 mb-6 text-center">
                <p className="text-xs font-bold text-[#D4AF37] mb-2 uppercase">Codul Tău</p>
                <div className="text-3xl md:text-4xl font-extrabold text-[#1a365d] mb-2 tracking-wider select-all">
                  {applicationCode}
                </div>
                <p className="text-xs text-gray-700 mb-2">Salvează acest cod pentru plată și email!</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(applicationCode);
                    toast.success('Cod copiat în clipboard!');
                  }}
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg text-sm font-bold hover:bg-[#B8960B] transition-colors"
                >
                  📋 Copiază Codul
                </button>
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
        {/* Subtle glow effect around the form */}
        <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-yellow-500/10 rounded-3xl blur-2xl pointer-events-none"></div>
        <div className="relative rounded-2xl border border-white/10 p-6 md:p-8">

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

        {/* Upgrade Mode Banner */}
        {isUpgradeMode && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⬆️</div>
              <div>
                <p className="text-purple-200 font-bold">Mod Upgrade</p>
                <p className="text-purple-300/80 text-sm">
                  Upgrade de la <span className="font-bold uppercase">{currentTier}</span> - plătești doar diferența de preț!
                </p>
              </div>
            </div>
          </div>
        )}

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
              {['basic', 'gold', 'platinum', 'suprem'].map((tier) => {
                const canSelect = canSelectTier(tier);
                return (
                  <label
                    key={tier}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-xl transition-all ${
                      !canSelect
                        ? 'opacity-40 cursor-not-allowed border-white/10 bg-white/5'
                        : formData.tier === tier
                          ? tier === 'suprem'
                            ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 scale-105 cursor-pointer'
                            : tier === 'platinum'
                              ? 'border-gray-300 bg-gradient-to-br from-gray-200/20 to-gray-300/20 scale-105 cursor-pointer'
                              : tier === 'gold'
                                ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 scale-105 cursor-pointer'
                                : 'border-gray-400 bg-white/10 scale-105 cursor-pointer'
                          : 'border-white/20 hover:border-white/40 bg-white/5 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={tier}
                      checked={formData.tier === tier}
                      onChange={canSelect ? handleChange : undefined}
                      disabled={!canSelect}
                      className="sr-only"
                    />
                    {formData.tier === tier && canSelect && (
                      <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                        tier === 'suprem' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                      }`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {!canSelect && isUpgradeMode && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✗</span>
                      </div>
                    )}
                    <span className="text-2xl mb-1">
                      {tier === 'basic' ? '⭐' : tier === 'gold' ? '🏆' : tier === 'platinum' ? '💎' : <img src="/Crown.png" alt="Crown" className="w-7 h-7 object-contain mx-auto" />}
                    </span>
                    <span className={`font-bold uppercase text-xs ${
                      !canSelect
                        ? 'text-white/40'
                        : formData.tier === tier
                          ? tier === 'suprem' ? 'text-purple-300' : 'text-yellow-400'
                          : 'text-white/70'
                    }`}>{tier}</span>
                    <span className={`text-xs font-semibold ${
                      !canSelect ? 'text-white/30' : formData.tier === tier ? 'text-white/80' : 'text-white/50'
                    }`}>
                      {tier === 'suprem'
                        ? 'TEMPORAR'
                        : isUpgradeMode && canSelect
                          ? `+${getUpgradePrice(tier)} RON`
                          : tierPrices[tier]
                      }
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Suprem Hours Input */}
            {formData.tier === 'suprem' && (
              <div className="mt-4 p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border-2 border-purple-500/50">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/Crown.png" alt="Crown" className="w-7 h-7 object-contain" />
                  <h4 className="text-lg font-bold text-white">Alege numărul de ore</h4>
                </div>

                {/* Hours Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Câte ore vrei să fii Barosanul Suprem?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      name="supremHours"
                      value={formData.supremHours}
                      onChange={handleChange}
                      min="1"
                      max="168"
                      className="w-24 px-4 py-3 bg-white/10 border-2 border-purple-400/50 rounded-xl text-white text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <span className="text-white/80 font-semibold">
                      {parseInt(formData.supremHours) === 1 ? 'oră' : 'ore'}
                    </span>
                  </div>
                  <p className="text-purple-300/60 text-xs mt-2">Minim 1 oră, maxim 168 ore (1 săptămână)</p>
                </div>

                {/* Quick Select Buttons */}
                <div className="mb-4">
                  <p className="text-sm text-purple-200/80 mb-2">Selectare rapidă:</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 6, 12, 24, 48, 72].map(hours => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, supremHours: hours.toString() }))}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                          parseInt(formData.supremHours) === hours
                            ? 'bg-purple-500 text-white scale-105'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {hours}h
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200/60 text-xs">Preț per oră</p>
                      <p className="text-white font-semibold">50 RON</p>
                    </div>
                    {parseInt(formData.supremHours) >= 12 && (
                      <div className="text-center">
                        <p className="text-green-400 text-xs font-bold">DISCOUNT</p>
                        <p className="text-green-300 font-bold text-lg">
                          -{parseInt(formData.supremHours) >= 24 ? '20%' : '10%'}
                        </p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-purple-200/60 text-xs">Total de plată</p>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {calculateSupremPrice(formData.supremHours)} RON
                      </p>
                    </div>
                  </div>
                  {parseInt(formData.supremHours) < 12 && (
                    <p className="text-yellow-400/80 text-xs mt-2 text-center">
                      💡 Comandă 12+ ore pentru 10% discount sau 24+ ore pentru 20% discount!
                    </p>
                  )}
                </div>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={uploading}
              className="px-6 py-4 rounded-xl font-bold text-base transition-all bg-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-400 border border-white/20 hover:border-red-500/50"
            >
              ✕ Anulează
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
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
                  <span>Se încarcă...</span>
                </span>
              ) : (
                'Generează Cod 🎯'
              )}
            </button>
          </div>

          <p className="text-xs text-white/50 text-center bg-white/5 rounded-lg p-3 border border-white/10">
            După trimitere vei primi un cod unic pentru plată și email.
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
