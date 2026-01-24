import { useSEO } from '../hooks/useSEO';

export default function Confidentialitate() {
  useSEO({
    title: 'Politica de Confidențialitate',
    description: 'Politica de confidențialitate și protecția datelor personale în Registrul Oficial al Barosanilor.',
    url: '/confidentialitate'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#E8D5B7] to-[#F5E6D3] py-12 md:py-16 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1a365d] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] to-[#2d5986] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full mb-4 shadow-xl">
                <span className="text-4xl md:text-5xl">🔒</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-2">
                Politica de Confidențialitate
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Ultima actualizare: Ianuarie 2025</p>
            </div>

        <div className="space-y-8 text-gray-700">
          {[
            { num: 1, title: "Introducere", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Respectăm confidențialitatea datelor dumneavoastră personale. Această politică explică
                  ce informații colectăm, cum le folosim și care sunt drepturile dumneavoastră conform GDPR
                  (Regulamentul General privind Protecția Datelor).
                </p>
              </div>
            )},
            { num: 2, title: "Date Personale Colectate", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Colectăm următoarele informații când vă înregistrați:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Nume</strong> - pentru afișare pe site și certificat</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Email</strong> - pentru comunicare și verificare identitate</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Revolut ID</strong> - pentru identificarea plăților</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Motto personal</strong> - pentru afișare pe card</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Poză (opțional)</strong> - pentru afișare pe card</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Link personal (opțional)</strong> - doar pentru tier Platinum</span></li>
                </ul>
              </div>
            )},
            { num: 3, title: "Scopul Prelucrării Datelor", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Folosim datele dumneavoastră pentru:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Afișarea profilului în <strong>"Registrul Oficial al Barosanilor"</strong></span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Generarea certificatului digital</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Procesarea și verificarea plăților</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Comunicare privind statusul abonamentului</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Îmbunătățirea serviciilor noastre</span></li>
                </ul>
              </div>
            )},
            { num: 4, title: "Baza Legală a Prelucrării", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Prelucrăm datele dumneavoastră pe baza:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Consimțământ</strong> - prin completarea formularului acceptați prelucrarea datelor</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Contract</strong> - pentru furnizarea serviciilor achiziționate</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Interes legitim</strong> - pentru îmbunătățirea serviciilor</span></li>
                </ul>
              </div>
            )},
            { num: 5, title: "Partajarea Datelor", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Datele dumneavoastră sunt afișate <strong>public pe site</strong> (nume, poză, motto, link pentru Platinum).
                  Prin înregistrare, sunteți de acord cu această afișare publică.
                </p>
                <p>
                  <strong>Nu vindem sau partajăm</strong> datele dumneavoastră (email, Revolut ID) cu terțe părți
                  pentru marketing sau alte scopuri comerciale.
                </p>
              </div>
            )},
            { num: 6, title: "Cookies și Tehnologii Similare", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Site-ul folosește tehnologii standard web (localStorage) pentru a stoca temporar datele
                  formularului în browserul dumneavoastră. Aceste date rămân pe dispozitivul dumneavoastră
                  și nu sunt transmise automat către noi.
                </p>
                <p>Nu folosim cookies de tracking sau marketing în acest moment.</p>
              </div>
            )},
            { num: 7, title: "Securitatea Datelor", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Implementăm măsuri de securitate pentru protejarea datelor dumneavoastră:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Stocare securizată a datelor</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Acces restricționat la informații sensibile (email, Revolut ID)</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Backup-uri regulate</span></li>
                </ul>
                <p>Totuși, nicio metodă de transmitere sau stocare nu este 100% sigură. Nu putem garanta securitatea absolută.</p>
              </div>
            )},
            { num: 8, title: "Drepturile Dumneavoastră GDPR", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Conform GDPR, aveți următoarele drepturi:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul de acces</strong> - să vedeți ce date avem despre dumneavoastră</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul de rectificare</strong> - să corectați datele incorecte</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul la ștergere</strong> ("dreptul de a fi uitat") - să ștergeți contul și datele</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul de restricționare</strong> - să limitați prelucrarea datelor</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul la portabilitate</strong> - să primiți datele într-un format portabil</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul de opoziție</strong> - să vă opuneți prelucrării</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Dreptul de a retrage consimțământul</strong> - oricând</span></li>
                </ul>
              </div>
            )},
            { num: 9, title: "Retenția Datelor", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Păstrăm datele dumneavoastră atât timp cât abonamentul este activ. După expirarea
                  abonamentului și neînnoirea acestuia, datele pot fi arhivate sau șterse după o perioadă
                  de grație de 30 de zile.
                </p>
                <p>Puteți solicita ștergerea imediată a datelor în orice moment prin contact.</p>
              </div>
            )},
            { num: 10, title: "Minori", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Serviciile noastre nu sunt destinate persoanelor sub 18 ani. Nu colectăm intenționat
                  date de la minori. Dacă aflăm că am colectat date de la un minor, le vom șterge prompt.
                </p>
              </div>
            )},
            { num: 11, title: "Modificări ale Politicii", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Ne rezervăm dreptul de a actualiza această politică. Modificările vor fi publicate pe
                  site cu data actualizării. Continuarea folosirii serviciilor după modificări constituie
                  acceptarea noii politici.
                </p>
              </div>
            )},
            { num: 12, title: "Contact și Plângeri", content: (
              <div className="space-y-3 leading-relaxed">
                <p>
                  Pentru exercitarea drepturilor sau întrebări despre confidențialitate, contactați-ne
                  la adresa de email din pagina de contact.
                </p>
                <p>
                  Aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a
                  Prelucrării Datelor cu Caracter Personal (ANSPDCP) dacă considerați că drepturile
                  dumneavoastră au fost încălcate.
                </p>
              </div>
            )}
          ].map(section => (
            <section key={section.num} className="relative group/section">
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#FFD700] rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity"></div>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xl font-extrabold text-[#1a365d]">{section.num}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a365d] mt-1">{section.title}</h2>
              </div>
              {section.content}
            </section>
          ))}

          {/* Disclaimer - Enhanced */}
          <div className="relative group/disclaimer mt-10">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-20 group-hover/disclaimer:opacity-30 transition-opacity"></div>
            <div className="relative bg-blue-50 border-l-4 border-blue-400 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">ℹ️</span>
                </div>
                <div>
                  <p className="font-extrabold text-blue-900 mb-2">Informare Importantă</p>
                  <p className="text-sm md:text-base text-blue-800 leading-relaxed">
                    Datele publice (nume, poză, motto, link) vor fi vizibile pe site. Asigurați-vă că
                    sunteți confortabil cu această afișare înainte de înregistrare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}
