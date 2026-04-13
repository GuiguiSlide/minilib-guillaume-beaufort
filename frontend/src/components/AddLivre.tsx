// ── AddLivre Component ──
// Form for creating new books or editing existing ones
// Handles both CREATE (POST) and UPDATE (PUT) operations through the API

import React, { useState, useEffect } from "react";
import type { Livre } from "../types/livre";

/**
 * Props for AddLivre component
 * @prop onAdd - Callback fired when a new book is successfully created
 * @prop onUpdate - Callback fired when an existing book is successfully updated
 * @prop livreToEdit - Optional book object for edit mode (null/undefined = add mode)
 * @prop onCancel - Optional callback to cancel editing mode
 */
interface AddLivreProps {
    onAdd: (livre: Livre) => void;
    onUpdate: (livre: Livre) => void;
    livreToEdit?: Livre | null;
    onCancel?: () => void;
}

/**
 * AddLivre Component
 * Toggles between "Add new book" and "Edit existing book" modes
 * Form auto-populates when livreToEdit is provided
 */
const AddLivre: React.FC<AddLivreProps> = ({
    onAdd,
    onUpdate,
    livreToEdit,
    onCancel
}) => {
    // ── FORM STATE (individual fields) ──
    const [titre, setTitre] = useState("");
    const [auteur, setAuteur] = useState("");
    const [annee, setAnnee] = useState("");
    const [isbn, setIsbn] = useState("");
    const [genre, setGenre] = useState("");

    /**
     * Populates form with book data when entering edit mode
     * Clears form when returning to add mode
     * Triggers whenever livreToEdit prop changes
     */
    useEffect(() => {
        if (livreToEdit) {
            // ── EDIT MODE: Fill form with existing book data ──
            setTitre(livreToEdit.titre);
            setAuteur(livreToEdit.auteur);
            setAnnee(livreToEdit.annee ? String(livreToEdit.annee) : "");
            setIsbn(livreToEdit.isbn);
            setGenre(livreToEdit.genre || "");
        } else {
            // ── ADD MODE: Clear all form fields ──
            setTitre("");
            setAuteur("");
            setAnnee("");
            setIsbn("");
            setGenre("");
        }
    }, [livreToEdit]);

    /**
     * Handles form submission for both CREATE and UPDATE operations
     * Validates ISBN (generates one if missing)
     * Sends appropriate HTTP request to backend
     * Calls parent updater or onAdd callback on success
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ── ISBN: Use provided or generate random default ──
        const finalIsbn = isbn.trim() ? isbn : Math.random().toString().substring(2, 15).padEnd(13, '0');

        // ── BUILD PAYLOAD: Include only non-empty optional fields ──
        const payload = {
            titre,
            auteur,
            annee: annee ? Number(annee) : undefined,
            genre: genre || undefined,
            isbn: finalIsbn,
        };

        if (livreToEdit && livreToEdit.id) {
            // ── UPDATE MODE: Send PUT request to existing book endpoint ──
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
                    // ── SUCCESS: Notify parent and close edit form ──
                    onUpdate(updated);
                    onCancel?.();
                })
                .catch(console.error);
        } else {
            // ── CREATE MODE: Send POST request to create new book ──
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
                    // ── SUCCESS: Notify parent and clear form for next entry ──
                    onAdd(newLivre);
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
            {/* ── TITLE INPUT ── */}
            <input
                type="text"
                placeholder="Titre (ex: Le Seigneur des Anneaux)"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
            />
            
            {/* ── AUTHOR INPUT ── */}
            <input
                type="text"
                placeholder="Auteur (ex: J.R.R. Tolkien)"
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                required
            />
            
            {/* ── YEAR INPUT ── */}
            <input
                type="number"
                placeholder="Année (ex: 1954)"
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
            />
            
            {/* ── ISBN INPUT ── */}
            <input
                type="text"
                placeholder="ISBN (ex: 9782253045939 - optionnel)"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
            />
            
            {/* ── GENRE INPUT ── */}
            <input
                type="text"
                placeholder="Genre (ex: Fantasy)"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />
            
            {/* ── SUBMIT BUTTON (text changes based on mode) ── */}
            <button type="submit">{livreToEdit ? "Modifier" : "Ajouter"}</button>
            
            {/* ── CANCEL BUTTON (only visible in edit mode) ── */}
            {livreToEdit && onCancel && (
                <button type="button" onClick={onCancel}>
                    Annuler
                </button>
            )}
        </form>
    );
};

export default AddLivre;