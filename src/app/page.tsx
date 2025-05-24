"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, User, User2 } from "lucide-react";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [genero, setGenero] = useState("");
  const [grado, setGrado] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [agregar, setAgregar] = useState(true);
  const [id, setId] = useState(0);

  const [errores, setErrores] = useState({
    nombre: "",
    edad: "",
    genero: "",
    grado: "",
  });

  const obtenerAlumnos = async () => {
    const res = await fetch("http://localhost:8080/alumnos");
    const data = await res.json();
    setAlumnos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { nombre: "", edad: "", genero: "", grado: "" };

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    }
    if (edad <= 0) {
      newErrors.edad = "Ingresa una edad válida";
      valid = false;
    }
    if (!genero) {
      newErrors.genero = "Selecciona un género";
      valid = false;
    }
    if (!grado) {
      newErrors.grado = "Selecciona un grado";
      valid = false;
    }

    setErrores(newErrors);

    if (!valid) return;

    if (agregar) {
      try {
        const res = await axios.post("http://localhost:8080/alumno", {
          nombre,
          edad,
          genero,
          grado,
        });
        setRespuesta(JSON.stringify(res.data, null, 2));
        alert("Alumno registrado correctamente.");
      } catch (error: any) {
        setRespuesta("Error: " + error.message);
      }
    } else {
      try {
        const res = await axios.put(`http://localhost:8080/alumno/${id}`, {
          nombre,
          edad,
          genero,
          grado,
        });
        setRespuesta(JSON.stringify(res.data, null, 2));
        alert("Alumno modificado correctamente.");
      } catch (error: any) {
        setRespuesta("Error: " + error.message);
      }
    }

    obtenerAlumnos();
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEdad(0);
    setGenero("");
    setGrado("");
    setAgregar(true);
  };

  const editarAlumno = (alumno: any) => {
    setId(alumno.id);
    setNombre(alumno.nombre);
    setEdad(alumno.edad);
    setGenero(alumno.genero);
    setGrado(alumno.grado);
    setAgregar(false);
  };

  const eliminarAlumno = async (id: number, nombre: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar el alumno ${nombre}?`
    );
    if (!confirmDelete) return;

    await fetch(`http://localhost:8080/alumno/${id}`, {
      method: "DELETE",
    });
    obtenerAlumnos(); // recargar lista
  };

  useEffect(() => {
    obtenerAlumnos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      {/* Formulario */}
      <div className="bg-white p-8 rounded-xl shadow w-1/2">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">
          {agregar ? "Ingreso" : "Modificación"} de Alumnos
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg w-96"
        >
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border border-gray-300 bg-white text-black placeholder-gray-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errores.nombre && (
            <p className="text-red-500 text-sm">{errores.nombre}</p>
          )}
          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(+e.target.value)}
            className="border border-gray-300 bg-white text-black placeholder-gray-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errores.edad && (
            <p className="text-red-500 text-sm">{errores.edad}</p>
          )}
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="border border-gray-300 bg-white text-black p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          {errores.genero && (
            <p className="text-red-500 text-sm">{errores.genero}</p>
          )}

          <select
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            className="border border-gray-300 bg-white text-black p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Grado</option>
            <option value="Primaria">Primaria</option>
            <option value="Basicos">Básicos</option>
            <option value="Diversificado">Diversificado</option>
            <option value="Universitario">Universitario</option>
          </select>
          {errores.grado && (
            <p className="text-red-500 text-sm">{errores.grado}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {agregar ? "Guardar" : "Modificar"}
          </button>
        </form>

        {/* {respuesta && (
          <div className="mt-6 p-4 bg-gray-50 border rounded w-96">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Respuesta:
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {respuesta}
            </pre>
          </div>
        )} */}
      </div>
      <div className="bg-white p-8 rounded-xl shadow w-1/2 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Listado de Alumnos
        </h2>
        <ul className="space-y-3 ">
          {alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="flex justify-between items-center p-2 border rounded mb-2"
            >
              <div className="flex items-center space-x-2">
                {/* Icono según género */}
                {alumno.genero.toLowerCase() === "masculino" ? (
                  <User className="text-blue-500" size={20} />
                ) : (
                  <User2 className="text-pink-500" size={20} />
                )}

                <div>
                  <p className="font-semibold text-black">{alumno.nombre}</p>
                  <p className="text-sm text-black">
                    Edad: {alumno.edad} | Grado: {alumno.grado} | Género:{" "}
                    {alumno.genero}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => eliminarAlumno(alumno.id, alumno.nombre)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => editarAlumno(alumno)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
