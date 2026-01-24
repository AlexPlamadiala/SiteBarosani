import { useSEO } from '../hooks/useSEO';

export default function Termeni() {
  useSEO({
    title: 'Termeni și Condiții',
    description: 'Termenii și condițiile de utilizare a Registrului Oficial al Barosanilor.',
    url: '/termeni'
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
                <span className="text-4xl md:text-5xl">📜</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5986] mb-2">
                Termeni și Condiții
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Ultima actualizare: Ianuarie 2025</p>
            </div>

        <div className="space-y-8 text-gray-700">
          <section className="relative group/section">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#FFD700] rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl font-extrabold text-[#1a365d]">1</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a365d] mt-1">Natura Site-ului</h2>
            </div>
            <div className="space-y-3 leading-relaxed">
              <p>
                <strong>Registrul Oficial al Barosanilor</strong> este un proiect de satiră și divertisment. Acest site are caracter
                exclusiv parodic și nu reprezintă o instituție oficială, guvernamentală sau de certificare reală.
              </p>
              <p>
                Toate certificatele, badge-urile și titlurile oferite sunt simbolice și au scop exclusiv
                de amuzament. Acestea nu conferă niciun drept, statut legal sau recunoaștere oficială.
              </p>
            </div>
          </section>

          <section className="relative group/section">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#FFD700] rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl font-extrabold text-[#1a365d]">2</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a365d] mt-1">Servicii Oferite</h2>
            </div>
            <div className="space-y-3 leading-relaxed">
              <p>
                Oferim utilizatorilor posibilitatea de a apărea în <strong>"Registrul Oficial al Barosanilor"</strong> prin achiziționarea
                unui abonament lunar. Serviciile includ:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1.5">▸</span>
                  <span>Afișarea numelui, pozei și motto-ului pe site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1.5">▸</span>
                  <span>Generarea unui certificat digital satiric</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1.5">▸</span>
                  <span>Acces la diferite tier-uri (Basic, Gold, Platinum) cu beneficii vizuale diferite</span>
                </li>
              </ul>
            </div>
          </section>

          {[
            { num: 3, title: "Plăți și Abonamente", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Plățile se procesează manual prin Revolut. Tarifele sunt:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Basic:</strong> 20 RON/lună</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Gold:</strong> 50 RON/lună</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span><strong>Platinum:</strong> 100 RON/lună</span></li>
                </ul>
                <p>Plățile sunt în avans pentru luna curentă. Abonamentul este valabil pentru o lună calendaristică și trebuie reînnoit manual.</p>
              </div>
            )},
            { num: 4, title: "Politica de Rambursare", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Având în vedere natura digitală și instantanee a serviciilor (afișare imediată pe site și generare certificat), <strong>nu oferim rambursări</strong> după activarea contului.</p>
                <p>Dacă întâmpinați probleme tehnice sau nu primiți serviciile achiziționate, vă rugăm să ne contactați în primele 24 de ore pentru rezolvare.</p>
              </div>
            )},
            { num: 5, title: "Conținut Utilizator", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Prin trimiterea informațiilor (nume, poză, motto, link), confirmați că:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Aveți dreptul de a folosi și publica aceste informații</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Conținutul nu încalcă drepturile altora (proprietate intelectuală, drepturi de autor, etc.)</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Conținutul nu este ilegal, ofensator, defăimător sau discriminatoriu</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Poza folosită este a dumneavoastră sau aveți permisiunea de a o folosi</span></li>
                </ul>
                <p>Ne rezervăm dreptul de a refuza sau elimina orice conținut care încalcă aceste reguli, fără obligația de rambursare.</p>
              </div>
            )},
            { num: 6, title: "Limitarea Răspunderii", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Site-ul este oferit "ca atare" (as-is). Nu garantăm disponibilitatea continuă a serviciilor și nu suntem răspunzători pentru:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Întreruperi tehnice sau erori</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Pierderi de date</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Daune indirecte sau consecvente</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#D4AF37] mt-1.5">▸</span><span>Interpretarea eronată a naturii satirice a site-ului</span></li>
                </ul>
              </div>
            )},
            { num: 7, title: "Modificări", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor fi comunicate pe site și vor intra în vigoare imediat după publicare.</p>
              </div>
            )},
            { num: 8, title: "Legea Aplicabilă", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Acești termeni sunt guvernați de legile României. Orice dispută va fi rezolvată conform legislației române.</p>
              </div>
            )},
            { num: 9, title: "Contact", content: (
              <div className="space-y-3 leading-relaxed">
                <p>Pentru întrebări sau probleme legate de serviciile noastre, ne puteți contacta la adresa de email afișată în pagina de contact.</p>
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
            <div className="absolute inset-0 bg-yellow-500 rounded-xl blur opacity-20 group-hover/disclaimer:opacity-30 transition-opacity"></div>
            <div className="relative bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <p className="font-extrabold text-yellow-900 mb-2">ATENȚIE - Parodie / Satiră</p>
                  <p className="text-sm md:text-base text-yellow-800 leading-relaxed">
                    Acest site este o parodie/satiră. Certificatele și titlurile nu au valoare oficială sau juridică.
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
