import React, { useEffect, useState } from "react";
import api from "../api/client";

const AdminCatalogExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState({
    name: "",
    muscleGroup: "",
    difficulty: "",
    equipment: "",
    restTime: "",
    recommended: false,
    image: "",
    instructions: [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pour garder l'id de l'exercice en édition (null si création)
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/catalog-exercises");
      setExercises(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des exercices du catalogue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...form.instructions];
    newInstructions[index] = value;
    setForm((prev) => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setForm((prev) => ({ ...prev, instructions: [...prev.instructions, ""] }));
  };

  const removeInstruction = (index) => {
    if (form.instructions.length <= 1) return;
    const newInstructions = form.instructions.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, instructions: newInstructions }));
  };

  // Préparer le formulaire pour éditer un exercice existant
  const handleEdit = (exercise) => {
    setEditingExerciseId(exercise._id);
    setForm({
      name: exercise.name || "",
      muscleGroup: exercise.muscleGroup || "",
      difficulty: exercise.difficulty || "",
      equipment: exercise.equipment || "",
      restTime: exercise.restTime || "",
      recommended: exercise.recommended || false,
      image: exercise.image || "",
      instructions: exercise.instructions.length > 0 ? exercise.instructions : [""],
    });
  };

  // Annuler l'édition (vider le formulaire)
  const cancelEdit = () => {
    setEditingExerciseId(null);
    setForm({
      name: "",
      muscleGroup: "",
      difficulty: "",
      equipment: "",
      restTime: "",
      recommended: false,
      image: "",
      instructions: [""],
    });
  };

  // Ajouter un nouvel exercice
  const handleAdd = async () => {
    if (!form.name.trim() || !form.muscleGroup.trim()) {
      alert("Le nom et le groupe musculaire sont requis");
      return;
    }
    try {
      await api.post("/catalog-exercises", form);
      cancelEdit();
      fetchExercises();
    } catch (err) {
      alert(
        `Erreur lors de la création de l'exercice du catalogue : ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Mettre à jour un exercice existant
  const handleUpdate = async () => {
    if (!form.name.trim() || !form.muscleGroup.trim()) {
      alert("Le nom et le groupe musculaire sont requis");
      return;
    }
    try {
      await api.put(`/catalog-exercises/${editingExerciseId}`, form);
      cancelEdit();
      fetchExercises();
    } catch (err) {
      alert(
        `Erreur lors de la mise à jour de l'exercice : ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Supprimer un exercice
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet exercice du catalogue ?"))
      return;

    try {
      await api.delete(`/catalog-exercises/${id}`);
      if (editingExerciseId === id) cancelEdit();
      fetchExercises();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel - Gérer les Exercices du Catalogue</h2>

      <div style={{ marginBottom: 20 }}>
        <h3>{editingExerciseId ? "Modifier un exercice" : "Ajouter un exercice du catalogue"}</h3>

        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
        />

        <select
          name="muscleGroup"
          value={form.muscleGroup}
          onChange={handleChange}
        >
          <option value="">-- Sélectionner un groupe musculaire --</option>
          <option value="abs">Abdos</option>
          <option value="back">Dorsaux</option>
          <option value="biceps">Biceps</option>
          <option value="calves">Mollet</option>
          <option value="chest">Poitrine</option>
          <option value="shoulders">Épaules</option>
          <option value="triceps">Triceps</option>
          <option value="legs">Jambes</option>
        </select>

        <input
          name="difficulty"
          placeholder="Difficulté"
          value={form.difficulty}
          onChange={handleChange}
        />
        <input
          name="equipment"
          placeholder="Équipement"
          value={form.equipment}
          onChange={handleChange}
        />
        <input
          name="restTime"
          placeholder="Temps de repos"
          value={form.restTime}
          onChange={handleChange}
          type="number"
        />
        <label style={{ display: "block", marginTop: 10 }}>
          Recommandé
          <input
            name="recommended"
            type="checkbox"
            checked={form.recommended}
            onChange={handleChange}
            style={{ marginLeft: 8 }}
          />
        </label>
        <input
          name="image"
          placeholder="URL Image"
          value={form.image}
          onChange={handleChange}
        />

        <div style={{ marginTop: 10 }}>
          <label>Instructions :</label>
          {form.instructions.map((inst, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <input
                type="text"
                value={inst}
                onChange={(e) => handleInstructionChange(i, e.target.value)}
                placeholder={`Instruction #${i + 1}`}
              />
              {form.instructions.length > 1 && (
                <button type="button" onClick={() => removeInstruction(i)}>
                  Supprimer
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addInstruction}>
            Ajouter une instruction
          </button>
        </div>

        {editingExerciseId ? (
          <>
            <button onClick={handleUpdate} style={{ marginTop: 10 }}>
              Mettre à jour l'exercice
            </button>
            <button onClick={cancelEdit} style={{ marginLeft: 10, marginTop: 10 }}>
              Annuler
            </button>
          </>
        ) : (
          <button onClick={handleAdd} style={{ marginTop: 10 }}>
            Ajouter l'exercice du catalogue
          </button>
        )}
      </div>

      <h3>Liste des exercices du catalogue</h3>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {exercises.map((ex) => (
          <li key={ex._id} style={{ marginBottom: 10 }}>
            <strong>{ex.name}</strong> - {ex.muscleGroup}
            <button
              onClick={() => handleEdit(ex)}
              style={{ marginLeft: 10 }}
            >
              Modifier
            </button>
            <button
              onClick={() => handleDelete(ex._id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCatalogExercises;
