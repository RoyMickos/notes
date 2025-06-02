Need to dive deeper into AI, probably doing a certificate in 2025. Here are some LLM recommendations: 
FreeCodeCamp Tutorial
A comprehensive course by a LangChain engineer that walks you through implementing a RAG system from scratch. It covers indexing, retrieval, generation, and advanced topics like Adaptive RAG and query routing. This is a great resource for beginners and advanced users alike. The full tutorial is available on FreeCodeCamp's YouTube channel.

Real Python's RAG Chatbot Guide
This tutorial focuses on building a RAG-powered chatbot using LangChain, OpenAI, and Streamlit. It provides a hands-on approach, starting with setup and moving through retrieval and generation workflows. You also learn how to deploy your application using Docker. Check it out on the Real [Python website](https://realpython.com/build-llm-rag-chatbot-with-langchain/).
Use [flakes as a replacement for python venv](https://github.com/dtgoitia/nix-python)

MLJAR’s RAG with OpenAI API
This tutorial demonstrates how to create a RAG system using the OpenAI API. It covers chunking documents, generating embeddings, matching user queries with relevant content, and generating responses. This is ideal for those looking to focus on OpenAI's API capabilities. Find more details on the MLJAR site

Install the openui-web component to start creating RAGs using ollama.
docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama

Jäätiin: open-webui vaatii spesifin python-version (3.11) toimiakseen, joten se on parasta ajaa dockerista. Ongelmana on, että containerissa oleva openui ei saanut yhnteyttä hostilla olevaan ollamaan. Tuo ongelma pitäisi jotenkin saada ratkottua. Kokeiltiin 
```sh
❯ OLLAMA_HOST=0.0.0.0:11434 ollama serve
Error: listen tcp 0.0.0.0:11434: bind: address already in use
```
==> disabloitu ollama palvelu, katsotaan uudestaan rebootin jälkeen
## Nix and python
There seems to be controversy in the python setup in nix, as python packages are somehow wrapped to be nix packages. You can install pyhton packages as per the nix flake manifest, or have the nix [flake setup a virtual environment](https://github.com/dtgoitia/nix-python) or use a separate nix-based [devenv](https://devenv.sh/basics/) tool. Be careful here not to drop in a rabbit hole. Anyway, plan is to use a nix flake to set up the environment for the development, with maybe jupyter for specific notes.

## Neovim CodeCompanion and VectorCode
CodeCompanion is a LLM tool for neovim, like Avante. It can use a VectorCode utility, which builds a RAG of your project using ChromaDB.
I've installed VectorCode CLI using `pipx` and installed chromadb:0.6.3 via docker as instructed by VectorCode. You are using VectorCode CLI to build a database of your project, then a plugin allows you to utilize the database in LLM operations via CodeCompanion.
[CodeCompanion](https://codecompanion.olimorris.dev/)
[VecttorCode](https://github.com/Davidyz/VectorCode/tree/main?tab=readme-ov-file#installation)
[ChromaDB](https://docs.trychroma.com/docs/overview/introduction)

## RealPython RAG course
Seems to have beef. Created a Neo4J graph database account in the [web](https://neo4j.com/). Google credentials. Maybe study graph databases more?


## Where am I
Managed to use a nix flake. Now, still need to study how zsh would work with this. Anyway, managed to get with the tutorial to the first step where a python call for openai was  made using the python shell.
Played around with generating code using various models. ChatGPT by far best, but it has the advantage of having a lot more context as I\ve asked several questions about dynamodb. Phi3:mini seemed to generate promising code, but it started hallucinating.

---
[Nixos and flakes book](https://nixos-and-flakes.thiscute.world/preface)
[Nix language tutorial](https://nix.dev/tutorials/nix-language)
[multi-user-install on fedora](https://gist.github.com/matthewpi/08c3d652e7879e4c4c30bead7021ff73)
[Set up ollama in the cloud](https://www.youtube.com/watch?v=SAhUc9ywIiw)
