import logo from "../../assets/Logo.png";
import filtro from "../../assets/filtro.png";
import editar from "../../assets/icon-edit.png";
import lixo from "../../assets/icon-lixo.png";
import avatar from "../../assets/icone-avatar.png";
import logoff from "../../assets/logoff.svg";
import seta from "../../assets/seta-top.svg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalEditar from "../../components/ModalEditar";
import ModalRegistro from "../../components/ModalRegistro";
import "./style.css";

import api from "../../utils/api";

function Home() {
  const [modalOpenRegistro, setModalOpenRegistro] = useState(false);
  const [modalOpenEditar, setModalOpenEditar] = useState(false);
  const [transacoes, setTransacoes] = useState([]);
  const [transacaoAtual, setTransacaoAtual] = useState({});
  const [extrato, setExtrato] = useState({});
  const [usuario, setUsuario] = useState({});
  const [categoria, setCategoria] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      requisicaoTransacoes();
      nomeUsuario();
      atualizarExtrato();
      getCategoria();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line 
  }, []);

  async function requisicaoTransacoes() {
    try {
      const response = await api.get("/transacao", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransacoes(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleModalOpenRegistro() {
    setModalOpenRegistro(!modalOpenRegistro);
  }

  function handleModalOpenEditar(transacao) {
    setModalOpenEditar(!modalOpenEditar);
    setTransacaoAtual(transacao);
  }

  async function getCategoria() {
    try {
      const response = await api.get("/categoria", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategoria(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTransacao(id) {
    try {
      await api.delete(`/transacao/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await requisicaoTransacoes();
      await atualizarExtrato();
    } catch (error) {
      console.log(error);
    }
  }

  function removerSegundaPalavra(texto) {
    const palavras = texto.split("-");
    const palavra = palavras[0];

    const letra = palavra[0].toUpperCase();

    return letra + palavra.substring(1);
  }

  async function atualizarExtrato() {
    try {
      const response = await api.get("/transacao/extrato", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExtrato(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function nomeUsuario() {
    try {
      const response = await api.get("/usuario", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuario(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function deslogar() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <ModalRegistro
        modalOpenRegistro={modalOpenRegistro}
        handleModalOpenRegistro={handleModalOpenRegistro}
        setModalOpenRegistro={setModalOpenRegistro}
        requisicaoTransacoes={() => requisicaoTransacoes()}
        atualizarExtrato={() => atualizarExtrato()}
        categoria={categoria}
        token={token}
      />

      <ModalEditar
        modalOpenEditar={modalOpenEditar}
        handleModalOpenEditar={handleModalOpenEditar}
        setModalOpenEditar={setModalOpenEditar}
        transacaoAtual={transacaoAtual}
        setTransacaoAtual={setTransacaoAtual}
        requisicaoTransacoes={() => requisicaoTransacoes()}
        atualizarExtrato={() => atualizarExtrato()}
        categoria={categoria}
        token={token}
      />

      <header className="dash-header">
        <div className="dash-header-content">
          <img src={logo} alt="Logo" />

          <button className="dash-btn-profile">
            <img src={avatar} alt="Avatar" />
            <strong>{usuario.nome}</strong>
          </button>

          <button onClick={() => deslogar()}>
            <img src={logoff} alt="LogOut" />
          </button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-main-content">
          <button className="dash-btn-filter">
            <img src={filtro} alt="Filtro" />
            <span>Filtrar</span>
          </button>

          <div className="dash-main-resume">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <button>
                      Data
                      <img src={seta} alt="Seta" />
                    </button>
                  </th>
                  <th>Dia da semana</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>
                      {new Intl.DateTimeFormat("pt-BR", {
                        timeZone: "UTC",
                      }).format(new Date(transacao.data))}
                    </td>

                    <td>
                      {removerSegundaPalavra(
                        new Intl.DateTimeFormat("pt-BR", {
                          weekday: "long",
                          timeZone: "UTC",
                        }).format(new Date(transacao.data))
                      )}
                    </td>
                    <td>{transacao.descricao}</td>
                    <td>{transacao.categoria_nome}</td>
                    <td
                      className={
                        transacao.tipo === "saida"
                          ? `text-color-orange`
                          : `text-color-purple`
                      }
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        currency: "BRL",
                        style: "currency",
                      }).format(transacao.valor / 100)}
                    </td>
                    <td>
                      <div>
                        <button
                          onClick={() => handleModalOpenEditar(transacao)}
                        >
                          <img src={editar} alt="editar" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransacao(transacao.id)}
                        >
                          <img src={lixo} alt="excluir" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <aside className="aside">
              <div className="aside-content">
                <h2>Resumo</h2>

                <div>
                  <h3>Entradas</h3>
                  <strong className="text-color-purple">
                    R$ {(extrato.entrada / 100).toFixed(2).replace(".", ",")}
                  </strong>
                </div>

                <div>
                  <h3>Saídas</h3>
                  <strong className="text-color-orange">
                    R$ {(extrato.saida / 100).toFixed(2).replace(".", ",")}
                  </strong>
                </div>

                <div>
                  <h3>Saldo</h3>
                  <strong className="text-color-blue">
                    R$ {`${(
                      (extrato.entrada - extrato.saida) /
                      100
                    )
                      .toFixed(2)
                      .replace(".", ",")} `}</strong>
                </div>
              </div>

              <button onClick={() => handleModalOpenRegistro()}>
                Adicionar Registro
              </button>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
