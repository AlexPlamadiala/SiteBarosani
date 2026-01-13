export default function Termeni() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7] py-12 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-[#1a365d] mb-6 text-center">
          Termeni și Condiții
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">1. Natura Site-ului</h2>
            <p>
              Zidul Barosanilor este un proiect de satiră și divertisment. Acest site are caracter
              exclusiv parodic și nu reprezintă o instituție oficială, guvernamentală sau de certificare reală.
            </p>
            <p className="mt-2">
              Toate certificatele, badge-urile și titlurile oferite sunt simbolice și au scop exclusiv
              de amuzament. Acestea nu conferă niciun drept, statut legal sau recunoaștere oficială.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">2. Servicii Oferite</h2>
            <p>
              Oferim utilizatorilor posibilitatea de a apărea pe "Zidul Barosanilor" prin achiziționarea
              unui abonament lunar. Serviciile includ:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Afișarea numelui, pozei și motto-ului pe site</li>
              <li>Generarea unui certificat digital satiric</li>
              <li>Acces la diferite tier-uri (Basic, Gold, Platinum) cu beneficii vizuale diferite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">3. Plăți și Abonamente</h2>
            <p>
              Plățile se procesează manual prin Revolut. Tarifele sunt:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Basic: 20 RON/lună</li>
              <li>Gold: 50 RON/lună</li>
              <li>Platinum: 100 RON/lună</li>
            </ul>
            <p className="mt-2">
              Plățile sunt în avans pentru luna curentă. Abonamentul este valabil pentru o lună calendaristică
              și trebuie reînnoit manual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">4. Politica de Rambursare</h2>
            <p>
              Având în vedere natura digitală și instantanee a serviciilor (afișare imediată pe site și
              generare certificat), <strong>nu oferim rambursări</strong> după activarea contului.
            </p>
            <p className="mt-2">
              Dacă întâmpinați probleme tehnice sau nu primiți serviciile achiziționate, vă rugăm să ne
              contactați în primele 24 de ore pentru rezolvare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">5. Conținut Utilizator</h2>
            <p>
              Prin trimiterea informațiilor (nume, poză, motto, link), confirmați că:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Aveți dreptul de a folosi și publica aceste informații</li>
              <li>Conținutul nu încalcă drepturile altora (proprietate intelectuală, drepturi de autor, etc.)</li>
              <li>Conținutul nu este ilegal, ofensator, defăimător sau discriminatoriu</li>
              <li>Poza folosită este a dumneavoastră sau aveți permisiunea de a o folosi</li>
            </ul>
            <p className="mt-2">
              Ne rezervăm dreptul de a refuza sau elimina orice conținut care încalcă aceste reguli,
              fără obligația de rambursare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">6. Limitarea Răspunderii</h2>
            <p>
              Site-ul este oferit "ca atare" (as-is). Nu garantăm disponibilitatea continuă a serviciilor
              și nu suntem răspunzători pentru:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Întreruperi tehnice sau erori</li>
              <li>Pierderi de date</li>
              <li>Daune indirecte sau consecvente</li>
              <li>Interpretarea eronată a naturii satirice a site-ului</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">7. Modificări</h2>
            <p>
              Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor fi
              comunicate pe site și vor intra în vigoare imediat după publicare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">8. Legea Aplicabilă</h2>
            <p>
              Acești termeni sunt guvernați de legile României. Orice dispută va fi rezolvată conform
              legislației române.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">9. Contact</h2>
            <p>
              Pentru întrebări sau probleme legate de serviciile noastre, ne puteți contacta la
              adresa de email afișată în pagina de contact.
            </p>
          </section>

          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="font-semibold text-yellow-800">
              ⚠️ Atenție: Acest site este o parodie/satiră. Certificatele și titlurile nu au valoare
              oficială sau juridică.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-8 text-center">
            Ultima actualizare: Ianuarie 2025
          </p>
        </div>
      </div>
    </div>
  );
}
