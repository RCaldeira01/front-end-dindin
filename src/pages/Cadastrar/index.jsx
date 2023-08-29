import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import HeaderSign from "../../components/HeaderSign";
import api from '../../utils/api';
import "./style.css";

function Cadastrar() {

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.post('/usuario', form);
      localStorage.setItem('token', response.data.token);
      navigate('/login');

    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;

    setForm({ ...form, [key]: value });
  }

  return (
    <>
      <div className="container-main">
        <div className="content-main">
          <HeaderSign />

          <div className="container-sign-up">
            <form onSubmit={handleSubmit} className="sign-up">
              <h3>Cadastre-se</h3>

              <div className="input">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  value={form.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="input">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input">
                <label htmlFor="senha" >Senha</label>
                <input
                  type="password"
                  name="senha"
                  id="senha"
                  value={form.senha}
                  onChange={handleChange}
                />
              </div>

              <div className="input">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  id="confirmarSenha"
                  onChange={handleChange}
                />
              </div>

              <button className="btn-purple">Cadastrar</button>

              <Link className="form-link" to="/">Já tem cadastro? Clique aqui!</Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cadastrar;
