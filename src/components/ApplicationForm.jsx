import { useState } from 'react';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    motto: '',
    tier: 'basic',
    poza: '',
    link: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');
  const [errors, setErrors] = useState({});

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

    if (!formData.motto.trim()) {
      newErrors.motto = 'Motto-ul este obligatoriu';
    } else if (formData.motto.length > 50) {
      newErrors.motto = 'Motto-ul trebuie să aibă maximum 50 de caractere';
    }

    if (!formData.poza.trim()) {
      newErrors.poza = 'URL-ul pozei este obligatoriu';
    }

    if (formData.tier === 'platinum' && !formData.link.trim()) {
      newErrors.link = 'Link-ul este obligatoriu pentru tier-ul Platinum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate unique code
    const code = generateApplicationCode();
    setApplicationCode(code);

    // Save to localStorage
    const existingApps = JSON.parse(localStorage.getItem('barosaniApplications') || '[]');
    const newApplication = {
      ...formData,
      code,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    existingApps.push(newApplication);
    localStorage.setItem('barosaniApplications', JSON.stringify(existingApps));

    setSubmitted(true);
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

  const handleStartNew = () => {
    setFormData({
      nume: '',
      email: '',
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-2">Cerere Înregistrată!</h2>
            <p className="text-lg opacity-90">Codul tău de cerere a fost generat</p>
          </div>

          {/* Application Code Display */}
          <div className="p-8">
            <div className="bg-[#D4AF37] bg-opacity-20 border-4 border-[#D4AF37] rounded-lg p-8 mb-8 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-2">CODUL TĂU DE CERERE</p>
              <div className="text-5xl font-bold text-[#1a365d] mb-4 tracking-wider">
                {applicationCode}
              </div>
              <p className="text-sm text-gray-600">Salvează acest cod! Vei avea nevoie de el pentru plată și email.</p>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a365d]">Pașii Următori:</h3>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-bold text-blue-900 mb-2">📱 Pasul 1: Plata prin Revolut</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Trimite <strong>{tierPrices[formData.tier]}</strong> la: <strong>@username-revolut</strong></li>
                  <li>• În mesajul plății scrie: <strong className="text-blue-700">{applicationCode}</strong></li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-bold text-purple-900 mb-2">📧 Pasul 2: Trimite Email-ul</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Email: <strong>contact@zidulbarosanilor.ro</strong></li>
                  <li>• Subiect: <strong className="text-purple-700">Cerere Barosan - {applicationCode}</strong></li>
                  <li>• Atașează poza ta (JPG/PNG, min 400x400px)</li>
                  <li>• Menționează codul <strong className="text-purple-700">{applicationCode}</strong> în email</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-bold text-green-900 mb-2">⏱️ Pasul 3: Așteaptă Confirmarea</h4>
                <p className="text-sm">În maxim <strong>24 de ore</strong> de la confirmarea plății și primirea email-ului, vei apărea pe Zidul Barosanilor și vei primi certificatul pe email!</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ IMPORTANT</h4>
                <p className="text-sm">Codul <strong>{applicationCode}</strong> ajută administratorul să asocieze plata ta cu cererea și email-ul. <strong>Nu uita să-l incluzi în ambele locuri!</strong></p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-4">Rezumat Cerere:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Nume:</p>
                  <p className="font-semibold">{formData.nume}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-semibold">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tier:</p>
                  <p className="font-semibold uppercase">{formData.tier}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sumă:</p>
                  <p className="font-semibold">{tierPrices[formData.tier]}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Motto:</p>
                  <p className="font-semibold italic">"{formData.motto}"</p>
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-[#1a365d] mb-2 text-center">
          Formular de Înscriere Barosan
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Completează datele și primești un cod unic pentru a finaliza procesul
        </p>

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

          {/* Tier */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alege Tier-ul <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['basic', 'gold', 'platinum'].map((tier) => (
                <label
                  key={tier}
                  className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                  <span className="text-2xl mb-2">
                    {tier === 'basic' ? '⭐' : tier === 'gold' ? '🏆' : '💎'}
                  </span>
                  <span className="font-bold uppercase text-sm">{tier}</span>
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

          {/* Poza URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Poză <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="poza"
              value={formData.poza}
              onChange={handleChange}
              placeholder="https://exemplu.com/poza-mea.jpg"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                errors.poza ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.poza && <p className="text-red-500 text-sm mt-1">{errors.poza}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Sau trimite poza pe email după ce primești codul. Min 400x400px, format JPG/PNG.
            </p>
          </div>

          {/* Link (doar pentru Platinum) */}
          {formData.tier === 'platinum' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link Personal (Instagram/TikTok) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://instagram.com/username sau https://tiktok.com/@username"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.link ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#c19b2e] text-[#1a365d] py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Generează Cod de Cerere 🎯
          </button>

          <p className="text-xs text-gray-500 text-center">
            După trimiterea formularului vei primi un cod unic pe care trebuie să-l folosești pentru plată și email.
          </p>
        </form>
      </div>
    </div>
  );
}
