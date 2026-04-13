// ── AddAdherent Component ──
// Form for creating new members or editing existing ones
// Handles both CREATE (POST) and UPDATE (PUT) operations through the API

import React, { useState, useEffect } from "react";
import type { Adherent } from "../types/adherent";

/**
 * Props for AddAdherent component
 * @prop onAdd - Callback fired when a new member is successfully created
 * @prop onUpdate - Callback fired when an existing member is successfully updated
 * @prop adherentToEdit - Optional member object for edit mode (null/undefined = add mode)
 * @prop onCancel - Optional callback to cancel editing mode
 */
interface AddAdherentProps {
    onAdd: (adherent: Adherent) => void;
    onUpdate: (adherent: Adherent) => void;
    adherentToEdit?: Adherent | null;
    onCancel?: () => void;
}

/**
 * AddAdherent Component
 * Toggles between "Add new member" and "Edit existing member" modes
 * Form auto-populates when adherentToEdit is provided
 */
const AddAdherent: React.FC<AddAdherentProps> = ({
    onAdd,
    onUpdate,
    adherentToEdit,
    onCancel
}) => {
    // ── FORM STATE (individual fields) ──
    const [nom, setNom] = useState(adherentToEdit?.nom || "");
    const [prenom, setPrenom] = useState(adherentToEdit?.prenom || "");
    const [email, setEmail] = useState(adherentToEdit?.email || "");
    const [numeroAdherent, setNumeroAdherent] = useState(
        adherentToEdit?.numero_adherent || ""
    );

    /**
     * Populates form with member data when entering edit mode
     * Clears form when returning to add mode
     * Triggers whenever adherentToEdit prop changes
     */
    useEffect(() => {
        if (adherentToEdit) {
            // ── EDIT MODE: Fill form with existing member data ──
            setNom(adherentToEdit.nom);
            setPrenom(adherentToEdit.prenom);
            setEmail(adherentToEdit.email);
            setNumeroAdherent(adherentToEdit.numero_adherent);
        } else {
            // ── ADD MODE: Clear all form fields ──
            setNom("");
            setPrenom("");
            setEmail("");
            setNumeroAdherent("");
        }
    }, [adherentToEdit]);

    /**
     * Handles form submission for both CREATE and UPDATE operations
     * Sends appropriate HTTP request to backend
     * Calls parent updater or onAdd callback on success
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ── BUILD PAYLOAD: Member data to send ──
        const payload = {
            nom,
            prenom,
            email,
            numero_adherent: numeroAdherent,
        };

        if (adherentToEdit && adherentToEdit.id) {
            // ── UPDATE MODE: Send PUT request to existing member endpoint ──
            fetch(`http://localhost:5000/api/v1/adherents/${adherentToEdit.id}`, {
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
            // ── CREATE MODE: Send POST request to create new member ──
            fetch("http://localhost:5000/api/v1/adherents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Erreur création");
                    return res.json();
                })
                .then((newAdherent) => {
                    // ── SUCCESS: Notify parent and clear form for next entry ──
                    onAdd(newAdherent);
                    setNom("");
                    setPrenom("");
                    setEmail("");
                    setNumeroAdherent("");
                })
                .catch(console.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ── LAST NAME INPUT ── */}
            <input
                type="text"
                placeholder="Nom (ex: Dupont)"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
            />
            
            {/* ── FIRST NAME INPUT ── */}
            <input
                type="text"
                placeholder="Prénom (ex: Jean)"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
            />
            
            {/* ── EMAIL INPUT ── */}
            <input
                type="email"
                placeholder="Email (ex: jean.dupont@example.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            
            {/* ── MEMBER NUMBER (auto-generated by backend, read-only) ── */}
            <input
                type="text"
                placeholder="Numéro adhérent (auto-généré)"
                value={numeroAdherent}
                onChange={(e) => setNumeroAdherent(e.target.value)}
                disabled
            />
            
            {/* ── SUBMIT BUTTON (text changes based on mode) ── */}
            <button type="submit">{adherentToEdit ? "Modifier" : "Ajouter"}</button>
            
            {/* ── CANCEL BUTTON (only visible in edit mode) ── */}
            {adherentToEdit && onCancel && (
                <button type="button" onClick={onCancel}>
                    Annuler
                </button>
            )}
        </form>
    );
};

export default AddAdherent;