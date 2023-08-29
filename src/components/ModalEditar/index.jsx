import sair from "../../assets/exit.png";
import api from "../../utils/api";
import "./style.css";

function ModalEditar({
  modalOpenEditar,
  handleModalOpenEditar,
  setModalOpenEditar,
  transacaoAtual,
  setTransacaoAtual,
  requisicaoTransacoes,
  atualizarExtrato,
  categoria,
  token,
}) {

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.put(
        `/transacao/${transacaoAtual.id}`,
        { ...transacaoAtual },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpenEditar(!modalOpenEditar);
      requisicaoTransacoes();
      atualizarExtrato();
    } catch (error) {
      console.log(error);
    }
  }

  function handleOptionsType(tipo) {
    setTransacaoAtual({ ...transacaoAtual, tipo });
  }

  return (
    modalOpenEditar && (
      <div className="modal-container">
        <div className="modal-over" onClick={() => handleModalOpenEditar()}></div>
        <form onSubmit={handleSubmit} className="modal-form">
          <h2>Editar Registro</h2>

          <button
            type="button"
            className="modal-close"
            onClick={() => handleModalOpenEditar()}
          >
            <img src={sair} alt="exit" />
          </button>

          <div className="options">
            <button
              onClick={() => {
                handleOptionsType("entrada");
              }}
              type="button"
              name="tipo"
              className={transacaoAtual.tipo === "entrada" ? "active-on" : ""}
            >
              Entrada
            </button>
            <button
              onClick={() => {
                handleOptionsType("saida");
              }}
              type="button"
              name="tipo"
              className={transacaoAtual.tipo === "entrada" ? "" : "active-off"}
            >
              Saída
            </button>
          </div>

          <label htmlFor="valor">Valor</label>
          <input
            type="text"
            name="valor"
            id="valor"
            onChange={(e) =>
              setTransacaoAtual({
                ...transacaoAtual,
                valor: String(Number(e.target.value) * 100),
              })
            }
            value={transacaoAtual.valor / 100}
          />
          <label htmlFor="categoria_id">Categoria</label>
          <select
            name="categoria_id"
            id="categoria_id"
            onChange={(e) =>
              setTransacaoAtual({
                ...transacaoAtual,
                categoria_id: e.target.value,
              })
            }
            defaultValue={transacaoAtual.categoria_id}
          >
            {categoria &&
              categoria.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.descricao}
                  </option>
                );
              })}
          </select>
          <label htmlFor="data">Data</label>
          <input
            type="date"
            name="data"
            id="data"
            onChange={(e) =>
              setTransacaoAtual({ ...transacaoAtual, data: e.target.value })
            }
            defaultValue={transacaoAtual.data.split("T")[0]}
          />
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            name="descricao"
            id="descricao"
            onChange={(e) =>
              setTransacaoAtual({
                ...transacaoAtual,
                descricao: e.target.value,
              })
            }
            value={transacaoAtual.descricao}
          />

          <button type="submit">Confirmar</button>
        </form>
      </div>
    )
  );
}

export default ModalEditar;
