export default function Confidentialitate() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B7] py-12 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-[#1a365d] mb-6 text-center">
          Politica de Confidențialitate
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">1. Introducere</h2>
            <p>
              Respectăm confidențialitatea datelor dumneavoastră personale. Această politică explică
              ce informații colectăm, cum le folosim și care sunt drepturile dumneavoastră conform GDPR
              (Regulamentul General privind Protecția Datelor).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">2. Date Personale Colectate</h2>
            <p>Colectăm următoarele informații când vă înregistrați:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Nume</strong> - pentru afișare pe site și certificat</li>
              <li><strong>Email</strong> - pentru comunicare și verificare identitate</li>
              <li><strong>Revolut ID</strong> - pentru identificarea plăților</li>
              <li><strong>Motto personal</strong> - pentru afișare pe card</li>
              <li><strong>Poză (opțional)</strong> - pentru afișare pe card</li>
              <li><strong>Link personal (opțional)</strong> - doar pentru tier Platinum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">3. Scopul Prelucrării Datelor</h2>
            <p>Folosim datele dumneavoastră pentru:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Afișarea profilului pe "Zidul Barosanilor"</li>
              <li>Generarea certificatului digital</li>
              <li>Procesarea și verificarea plăților</li>
              <li>Comunicare privind statusul abonamentului</li>
              <li>Îmbunătățirea serviciilor noastre</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">4. Baza Legală a Prelucrării</h2>
            <p>
              Prelucrăm datele dumneavoastră pe baza:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Consimțământ</strong> - prin completarea formularului acceptați prelucrarea datelor</li>
              <li><strong>Contract</strong> - pentru furnizarea serviciilor achiziționate</li>
              <li><strong>Interes legitim</strong> - pentru îmbunătățirea serviciilor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">5. Partajarea Datelor</h2>
            <p>
              Datele dumneavoastră sunt afișate <strong>public pe site</strong> (nume, poză, motto, link pentru Platinum).
              Prin înregistrare, sunteți de acord cu această afișare publică.
            </p>
            <p className="mt-2">
              <strong>Nu vindem sau partajăm</strong> datele dumneavoastră (email, Revolut ID) cu terțe părți
              pentru marketing sau alte scopuri comerciale.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">6. Cookies și Tehnologii Similare</h2>
            <p>
              Site-ul folosește tehnologii standard web (localStorage) pentru a stoca temporar datele
              formularului în browserul dumneavoastră. Aceste date rămân pe dispozitivul dumneavoastră
              și nu sunt transmise automat către noi.
            </p>
            <p className="mt-2">
              Nu folosim cookies de tracking sau marketing în acest moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">7. Securitatea Datelor</h2>
            <p>
              Implementăm măsuri de securitate pentru protejarea datelor dumneavoastră:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Stocare securizată a datelor</li>
              <li>Acces restricționat la informații sensibile (email, Revolut ID)</li>
              <li>Backup-uri regulate</li>
            </ul>
            <p className="mt-2">
              Totuși, nicio metodă de transmitere sau stocare nu este 100% sigură. Nu putem garanta
              securitatea absolută.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">8. Drepturile Dumneavoastră GDPR</h2>
            <p>Conform GDPR, aveți următoarele drepturi:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Dreptul de acces</strong> - să vedeți ce date avem despre dumneavoastră</li>
              <li><strong>Dreptul de rectificare</strong> - să corectați datele incorecte</li>
              <li><strong>Dreptul la ștergere</strong> ("dreptul de a fi uitat") - să ștergeți contul și datele</li>
              <li><strong>Dreptul de restricționare</strong> - să limitați prelucrarea datelor</li>
              <li><strong>Dreptul la portabilitate</strong> - să primiți datele într-un format portabil</li>
              <li><strong>Dreptul de opoziție</strong> - să vă opuneți prelucrării</li>
              <li><strong>Dreptul de a retrage consimțământul</strong> - oricând</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">9. Retenția Datelor</h2>
            <p>
              Păstrăm datele dumneavoastră atât timp cât abonamentul este activ. După expirarea
              abonamentului și neînnoirea acestuia, datele pot fi arhivate sau șterse după o perioadă
              de grație de 30 de zile.
            </p>
            <p className="mt-2">
              Puteți solicita ștergerea imediată a datelor în orice moment prin contact.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">10. Minori</h2>
            <p>
              Serviciile noastre nu sunt destinate persoanelor sub 18 ani. Nu colectăm intenționat
              date de la minori. Dacă aflăm că am colectat date de la un minor, le vom șterge prompt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">11. Modificări ale Politicii</h2>
            <p>
              Ne rezervăm dreptul de a actualiza această politică. Modificările vor fi publicate pe
              site cu data actualizării. Continuarea folosirii serviciilor după modificări constituie
              acceptarea noii politici.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-3">12. Contact și Plângeri</h2>
            <p>
              Pentru exercitarea drepturilor sau întrebări despre confidențialitate, contactați-ne
              la adresa de email din pagina de contact.
            </p>
            <p className="mt-2">
              Aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a
              Prelucrării Datelor cu Caracter Personal (ANSPDCP) dacă considerați că drepturile
              dumneavoastră au fost încălcate.
            </p>
          </section>

          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="font-semibold text-blue-800">
              ℹ️ Datele publice (nume, poză, motto, link) vor fi vizibile pe site. Asigurați-vă că
              sunteți confortabil cu această afișare înainte de înregistrare.
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
