import React from 'react';
import { X, Heart, Sparkles, Copy, Check, Flower2 } from 'lucide-react';
import { POEM_STANZAS } from '../data/poemData';

interface FullLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullLetterModal: React.FC<FullLetterModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const fullLetterText = `Pour Koloina — Mon amour, ma lumière

Koloina,

Si mon cœur pouvait parler,
il prononcerait ton nom à chaque battement.
Si les étoiles pouvaient écrire,
elles dessineraient ton visage dans le ciel.
Et si les fleurs pouvaient raconter mes sentiments,
elles fleuriraient éternellement pour toi.

Tu es cette douceur qui apaise mes tempêtes,
cette lumière qui éclaire mes nuits,
ce sourire qui rend mes journées plus belles.
Je ne veux pas seulement t’aimer dans les beaux jours,
je veux être là lorsque le ciel devient gris,
lorsque le vent devient violent
et lorsque la vie nous met à l’épreuve.

Je serai là, Koloina.
Dans le calme comme dans la tempête,
dans les rires comme dans les larmes,
dans les jours faciles comme dans les jours difficiles.
Je resterai près de toi pour te soutenir,
pour te donner ma force lorsque tu en manqueras,
pour te rappeler que tu n'es jamais seule.

Mon amour pour toi n'est pas une simple promesse.
C'est une présence, une main tendue,
une épaule sur laquelle tu peux te reposer.
Même lorsque les chemins seront difficiles,
je chercherai toujours un chemin vers toi.

Alors laisse-moi planter dans notre histoire
un jardin rempli de fleurs,
une fleur pour chaque souvenir,
une rose pour chaque baiser,
une étoile pour chaque rêve partagé,
et un cœur pour chaque fois où mon amour
criera silencieusement ton prénom.

Koloina, je t'aime.
Je t'aime aujourd'hui,
je t'aimerai demain,
et aussi longtemps que mon cœur saura battre.

Et si un jour une grande tempête arrive,
ne regarde pas seulement le ciel :
regarde à côté de toi.

Tu me trouveras là.

Toujours là pour toi.
Toujours prêt à te soutenir.
Toujours prêt à avancer avec toi.

Parce que peu importe la tempête,
je ne veux pas être celui qui part.
Je veux être celui qui reste. ❤️🌹

Pour toi, Koloina,
mon amour, ma fleur,
ma plus belle histoire. ❤️`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="modal-full-letter"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-900 border border-rose-500/30 p-6 md:p-10 shadow-2xl rose-card-glow text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-letter-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-rose-900/60 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8 border-b border-rose-500/20 pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-widest text-rose-300 font-sans-clean">
              Lettre d'Amour Intégrale
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-2xl md:text-4xl font-serif-romantic font-semibold text-rose-100">
            Pour Koloina
          </h2>
          <p className="font-script text-xl md:text-2xl text-rose-400 mt-1">
            Mon amour, ma lumière
          </p>
        </div>

        {/* Letter Content */}
        <div className="space-y-6 font-cormorant text-lg md:text-xl leading-relaxed text-slate-200 text-center">
          {POEM_STANZAS.map((stanza) => (
            <div key={stanza.id} className="py-2 border-b border-slate-800/50 last:border-0">
              <div className="space-y-1">
                {stanza.lines.map((line, idx) =>
                  line === '' ? (
                    <div key={idx} className="h-2" />
                  ) : (
                    <p
                      key={idx}
                      className={
                        line.startsWith('Koloina') || line.includes('Toujours') || line.includes('❤️')
                          ? 'font-semibold text-rose-300'
                          : ''
                      }
                    >
                      {line}
                    </p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-8 pt-6 border-t border-rose-500/20 flex items-center justify-between gap-4">
          <button
            id="btn-copy-poem"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-sans-clean text-slate-300 flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Poème copié avec amour !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-rose-400" />
                <span>Copier le poème</span>
              </>
            )}
          </button>

          <button
            id="btn-close-modal-bottom"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-sans-clean text-white font-medium shadow-md transition-colors cursor-pointer"
          >
            Fermer la lettre
          </button>
        </div>
      </div>
    </div>
  );
};
