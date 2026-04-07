// ── frontend/src/components/AddLivre.tsx ──
import React, { useState, useEffect } from "react";
import type { Livre } from "../types/livre";

interface AddLivreProps {
    onAdd: (livre: Livre) => void;
    onUpdate: (livre: Livre) => void;
    livreToEdit?: Livre | null;
    onCancel?: () => void;
}

const AddLivre: React.FC<AddLivreProps> = ({
    onAdd,
    onUpdate,
    livreToEdit,
    onCancel
}) => {
    const [titre, setTitre] = useState("");
    const [auteur, setAuteur] = useState("");
    const [annee, setAnnee] = useState("");
    const [isbn, setIsbn] = useState("");
    const [genre, setGenre] = useState("");

    useEffect(() => {
        if (livreToEdit) {
            setTitre(livreToEdit.titre);
            setAuteur(livreToEdit.auteur);
            setAnnee(livreToEdit.annee ? String(livreToEdit.annee) : "");
            setIsbn(livreToEdit.isbn);
            setGenre(livreToEdit.genre || "");
        } else {
            setTitre("");
            setAuteur("");
            setAnnee("");
            setIsbn("");
            setGenre("");
        }
    }, [livreToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalIsbn = isbn.trim() ? isbn : Math.random().toString().substring(2, 15).padEnd(13, '0');

        const payload = {
            titre,
            auteur,
            annee: annee ? Number(annee) : undefined,
            genre: genre || undefined,
            isbn: finalIsbn,
        };

        if (livreToEdit && livreToEdit.id) {
            // UPDATE via API
            fetch(`http://localhost:5000/api/v1/livres/${livreToEdit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Erreur update");
                    return res.json();
                })
                .then((updated) => {
                    onUpdate(updated);
                    onCancel?.();
                })
                .catch(console.error);
        } else {
            // CREATE via API
            fetch("http://localhost:5000/api/v1/livres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Erreur création");
                    return res.json();
                })
                .then((newLivre) => {
                    onAdd(newLivre);
                    // Clear form after successful add
                    setTitre("");
                    setAuteur("");
                    setAnnee("");
                    setIsbn("");
                    setGenre("");
                })
                .catch(console.error);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Titre (ex: Le Seigneur des Anneaux)"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Auteur (ex: J.R.R. Tolkien)"
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Année (ex: 1954)"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
            />
            <input
                type="text"
                placeholder="ISBN (ex: 9782253045939 - optionnel)"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
            />
            <input
                type="text"
                placeholder="Genre (ex: Fantasy)"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />
            <button type="submit">{livreToEdit ? "Modifier" : "Ajouter"}</button>
            {livreToEdit && onCancel && (
                <button type="button" onClick={onCancel}>
                    Annuler
                </button>
            )}
        </form>
    );
};

export default AddLivre;