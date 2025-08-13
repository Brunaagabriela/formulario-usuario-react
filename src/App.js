import React, { useState } from 'react';
import * as yup from 'yup';
import { IMaskInput } from 'react-imask';
import './App.css';

// Validação com Yup
const schema = yup.object({
  nome: yup
    .string()
    .trim()
    .min(3, 'Informe pelo menos 3 letras.')
    .required('Nome é obrigatório.'),
  email: yup
    .string()
    .trim()
    .email('E-mail inválido.')
    .required('E-mail é obrigatório.'),
  telefone: yup
    .string()
    .test('fone', 'Telefone inválido.', (v) => {
      const digits = String(v || '').replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11; // DDD + 8/9 dígitos
    })
    .required('Telefone é obrigatório.'),
  senha: yup
    .string()
    .min(6, 'Mínimo de 6 caracteres.')
    .required('Senha é obrigatória.'),
  confirmar: yup
    .string()
    .oneOf([yup.ref('senha')], 'As senhas não conferem.')
    .required('Confirme a senha.'),
});

function App() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmar: '',
  });
  const [erros, setErros] = useState({});
  const [okMsg, setOkMsg] = useState('');

  function setCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: '' }));
    setOkMsg('');
  }

  async function validarCampo(campo) {
    try {
      await schema.validateAt(campo, form);
      setErros((e) => ({ ...e, [campo]: '' }));
    } catch (err) {
      setErros((e) => ({ ...e, [campo]: err.message }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setOkMsg('');
    setErros({});
    try {
      await schema.validate(form, { abortEarly: false });
      setOkMsg('Cadastro realizado com sucesso! ✅');
      setForm({ nome: '', email: '', telefone: '', senha: '', confirmar: '' });
    } catch (err) {
      const bag = {};
      if (err.inner && err.inner.length) {
        err.inner.forEach((e) => (bag[e.path] = e.message));
      } else if (err.path) {
        bag[err.path] = err.message;
      }
      setErros(bag);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={onSubmit} noValidate>
        <h2>Cadastro de Usuário</h2>
        <p className="muted">Preencha os campos e envie para confirmar.</p>

        <div className="grid">
          <div className="field">
            <label>Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setCampo('nome', e.target.value)}
              onBlur={() => validarCampo('nome')}
              placeholder="Seu nome completo"
            />
            {erros.nome && <small className="err">{erros.nome}</small>}
          </div>

          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setCampo('email', e.target.value)}
              onBlur={() => validarCampo('email')}
              placeholder="voce@email.com"
            />
            {erros.email && <small className="err">{erros.email}</small>}
          </div>

          <div className="field">
            <label>Telefone</label>
            <IMaskInput
              // aceita 8 ou 9 dígitos: muda a máscara conforme a quantidade
              mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]}
              value={form.telefone}
              onAccept={(val) => setCampo('telefone', val)}
              onBlur={() => validarCampo('telefone')}
              placeholder="(00) 91234-5678"
              inputMode="numeric"
            />
            <small className="muted">Aceita 8 ou 9 dígitos (com DDD).</small>
            {erros.telefone && <small className="err">{erros.telefone}</small>}
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              value={form.senha}
              onChange={(e) => setCampo('senha', e.target.value)}
              onBlur={() => validarCampo('senha')}
              placeholder="Mínimo 6 caracteres"
            />
            {erros.senha && <small className="err">{erros.senha}</small>}
          </div>

          <div className="field">
            <label>Confirmar senha</label>
            <input
              type="password"
              value={form.confirmar}
              onChange={(e) => setCampo('confirmar', e.target.value)}
              onBlur={() => validarCampo('confirmar')}
              placeholder="Repita a senha"
            />
            {erros.confirmar && (
              <small className="err">{erros.confirmar}</small>
            )}
          </div>
        </div>

        <button className="btn" type="submit">
          Cadastrar
        </button>

        {okMsg && <div className="ok">{okMsg}</div>}
      </form>
    </div>
  );
}

export default App;
