import { toDate } from "date-fns";
import { useState } from "react";
import sair from "../../assets/exit.png";
import api from "../../utils/api";
import "./style.css";

function ModalRegistro({
  modalOpenRegistro,
  handleModalOpenRegistro,
  setModalOpenRegistro,
  requisicaoTransacoes,
  atualizarExtrato,
  categoria,
  token,
}) {

  const [optionsType, setOptionsType] = useState(true);
  const [form, setForm] = useState({
    tipo: "saida",
    descricao: "",
    valor: "",
    data: "",
    categoria_id: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      let valorEditado = String(Number(form.valor * 100));
      await api.post(
        "/transacao",
        { ...form, valor: valorEditado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpenRegistro(!modalOpenRegistro);
      requisicaoTransacoes();
      atualizarExtrato();
      setOptionsType(true);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;
    if (key === "categoria_id") {
      return setForm({ ...form, categoria_id: e.target.selectedIndex });
    }

    if (key === "data") {
      return setForm({ ...form, data: toDate(e.target.valueAsNumber) });
    }

    setForm({ ...form, [key]: value });
  }

  function handleOptionsType() {
    setOptionsType(!optionsType);
  }

  return (
    modalOpenRegistro && (
      <div className="modal-container">
        <div className="modal-over" onClick={() => {
          setOptionsType(true);
          return handleModalOpenRegistro()
        }}></div>
        <form onSubmit={handleSubmit} className="modal-form">
          <h2>Adicionar Registro</h2>

          <button
            type="button"
            className="modal-close"
            onClick={() => {
              setOptionsType(true);
              return handleModalOpenRegistro()
            }}
          >
            <img src={sair} alt="exit" />
          </button>

          <div className="options">
            <button
              onClick={() => {
                handleOptionsType();
                setForm({ ...form, tipo: "entrada" });
              }}
              type="button"
              name="tipo"
              className={optionsType ? "" : "active-on"}
            >
              Entrada
            </button>
            <button
              onClick={() => {
                handleOptionsType();
                setForm({ ...form, tipo: "saida" });
              }}
              type="button"
              name="tipo"
              className={optionsType ? "active-off" : ""}
            >
              Saída
            </button>
          </div>

          <label htmlFor="valor">Valor</label>
          <input type="text" name="valor" id="valor" onChange={handleChange} />
          <label htmlFor="categoria_id">Categoria</label>
          <select name="categoria_id" id="categoria_id" onChange={handleChange}>
            <option value="">Selecionar uma opção</option>
            {categoria &&
              categoria.map((item) => {
                return (
                  <option key={item.id} value={item.descricao}>
                    {item.descricao}
                  </option>
                );
              })}
          </select>
          <label htmlFor="data">Data</label>
          <input type="date" name="data" id="data" onChange={handleChange} />
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            name="descricao"
            id="descricao"
            onChange={handleChange}
          />

          <button type="submit">Confirmar</button>
        </form>
      </div>
    )
  );
}

export default ModalRegistro;
