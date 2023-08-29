import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

import HeaderSign from "../../components/HeaderSign";
import "./style.css";

function Login() {

  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.post('/login', form);
      localStorage.setItem('token', response.data.token);
      navigate('/home');

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

          <div className="container">
            <div className="left">
              <h1>
                Controle suas <strong>finanças</strong>, sem planilha chata.
              </h1>
              <h2>
                Organizar as suas finanças nunca foi tão fácil, com o DINDIN,
                você tem tudo num único lugar e em um clique de distância.
              </h2>

              <Link to={'/cadastro'}>
                <button className="btn-purple" >Cadastre-se</button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="login">
              <h3>Login</h3>

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
                <label htmlFor="senha" >Password</label>
                <input
                  type="password"
                  name="senha"
                  id="senha"
                  value={form.senha}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-purple">Entrar</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
