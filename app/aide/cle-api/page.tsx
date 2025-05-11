import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function ApiKeyGuidePage() {
  return (
    <div
      className="container py-12 px-4 min-h-screen"
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 font-fredoka text-white drop-shadow-md">
          Obtenir une clé API OpenAI
        </h1>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl space-y-6 border border-white/20">
          <ol className="space-y-6 text-lg leading-relaxed text-white">
            <li>
              <strong className="text-yellow-300 font-fredoka text-xl">
                1. Crée un compte sur OpenAI
              </strong>
              <br />
              Va sur{" "}
              <a
                href="https://platform.openai.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-purple-300 hover:text-purple-200 transition-colors"
              >
                platform.openai.com/signup
              </a>{" "}
              et crée ton compte (ou connecte-toi).
            </li>
            <li>
              <strong className="text-yellow-300 font-fredoka text-xl">
                2. Va dans la section API Keys
              </strong>
              <br />
              Clique sur{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-purple-300 hover:text-purple-200 transition-colors"
              >
                ce lien
              </a>{" "}
              pour accéder à tes clés API.
            </li>
            <li>
              <strong className="text-yellow-300 font-fredoka text-xl">
                3. Clique sur &quot;Create new secret key&quot;
              </strong>
              <br />
              Donne-lui un nom si tu veux, puis copie la clé qui commence par{" "}
              <code className="bg-purple-900/50 px-2 py-1 rounded text-white font-mono">
                sk-
              </code>
              .
            </li>
            <li>
              <strong className="text-yellow-300 font-fredoka text-xl">
                4. Reviens dans l&apos;application
              </strong>
              <br />
              Colle la clé dans le champ prévu dans le modal de configuration.
            </li>
          </ol>

          <div className="mt-10 text-center text-white/80 text-sm bg-purple-900/30 rounded-lg p-4">
            <p>
              Ta clé est stockée uniquement dans ton navigateur.
              <br />
              Elle n&apos;est <strong>jamais partagée</strong> ni envoyée à un
              serveur.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center text-sm text-center w-full text-white hover:text-yellow-300 transition-colors font-medium bg-purple-800/30 py-3 rounded-full hover:bg-purple-800/50"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
