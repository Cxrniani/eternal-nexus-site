# Etternal Nexus Experience — Frontend

Interface web do projeto **Etternal Nexus Experience**, desenvolvida com **Next.js**, **React** e **TypeScript**. Este projeto foi construído como estudo de caso de um sistema completo para gerenciamento de eventos.

🔗 [Repositório do Backend](https://github.com/Cxrniani/apis-synopsy/tree/master)

---

## 🧰 Tecnologias Utilizadas

- **Next.js** com SSR
- **React**
- **TypeScript**
- **Axios** para requisições HTTP
- **Quill.js** para edição de texto no CMS
- **Tailwind CSS** (caso utilizado)
- **Amazon S3** para armazenar mídias (via backend)

---

## 🌟 Funcionalidades

### 🖼️ Hero Section com Carrossel

- Imagens dinâmicas adicionadas via CMS
- Armazenamento das mídias no Amazon S3

### 📰 Seção de Notícias

- Editor de texto com Quill.js
- Upload de imagens integrado via CMS

### ℹ️ Seção de Informações

- Detalhes sobre o evento e seus organizadores

### 👤 Área do Usuário

- Visualização de ingressos comprados
- Exibição de QR Code gerado e informações sobre o ingresso
- Ingressos são inutilizados após leitura pelos administradores

### 🎟️ Compra de Ingressos

- Integração com o backend para exibir lotes disponíveis
- Pagamento via Mercado Pago (PIX e cartão)
- Redirecionamento automático após pagamento aprovado

---

## 🌍 Deploy

- Dockerizado
- Implantado em uma **instância EC2 pública**
- Comunicação direta com a instância backend (privada)

---

**Etternal Nexus Experience — Frontend** ✨
