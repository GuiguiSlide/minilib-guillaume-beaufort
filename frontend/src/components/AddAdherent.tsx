// ── frontend/src/components/AddAdherent.tsx ──
import React, { useState, useEffect } from "react";
import type { Adherent } from "../types/adherent";

interface AddAdherentProps {
    onAdd: (adherent: Adherent) => void;
    onUpdate: (adherent: Adherent) => void;
    adherentToEdit?: Adherent | null;
    onCancel?: () => void; // <-- add this line
}

const AddAdherent: React.FC<AddAdherentProps> = ({
    onAdd,
    onUpdate,
    adherentToEdit,
    onCancel
}) => {
    const [nom, setNom] = useState(adherentToEdit?.nom || "");
    const [prenom, setPrenom] = useState(adherentToEdit?.prenom || "");
    const [email, setEmail] = useState(adherentToEdit?.email || "");
    const [numeroAdherent, setNumeroAdherent] = useState(
        adherentToEdit?.numero_adherent || ""
    );

    // Reset form on edit cancel or new add
    useEffect(() => {
        if (adherentToEdit) {
            setNom(adherentToEdit.nom);
            setPrenom(adherentToEdit.prenom);
            setEmail(adherentToEdit.email);
            setNumeroAdherent(adherentToEdit.numero_adherent);
        } else {
            setNom("");
            setPrenom("");
            setEmail("");
            setNumeroAdherent("");
        }
    }, [adherentToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nom,
            prenom,
            email,
            numero_adherent: numeroAdherent,
        };

        if (adherentToEdit && adherentToEdit.id) {
            // UPDATE via API
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
                    onUpdate(updated);
                    onCancel?.();
                })
                .catch(console.error);
        } else {
            // CREATE via API
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
                    onAdd(newAdherent);
                    // Clear form after successful add
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
            <input
                type="text"
                placeholder="Nom (ex: Dupont)"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Prénom (ex: Jean)"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email (ex: jean.dupont@example.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Numéro adhérent (auto-généré)"
                value={numeroAdherent}
                onChange={(e) => setNumeroAdherent(e.target.value)}
                disabled
            />
            <button type="submit">{adherentToEdit ? "Modifier" : "Ajouter"}</button>
            {adherentToEdit && onCancel && (
                <button type="button" onClick={onCancel}>
                    Annuler
                </button>
            )}
        </form>
    );
};

export default AddAdherent;