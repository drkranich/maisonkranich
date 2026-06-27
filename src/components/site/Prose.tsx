/** Renderiza um texto (body) em parágrafos elegantes, separando por linha em branco. */
export function Prose({ body }: { body: string }) {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="space-y-5 font-serif text-lg leading-relaxed text-marfim/75">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
