const app = {
  chaveLacunas: "doc_lacunas_v1",
  chaveChecklist: "doc_checklist_mvp_v1",

  init(){
    this.carregarChecklist();
    this.carregarLacunas();
    this.atualizarPreview();
  },

  imprimir(){
    window.print();
  },

  copiarTexto(seletor){
    const el = document.querySelector(seletor);
    if(!el) return alert("Seção não encontrada.");
    const texto = el.innerText.trim();
    navigator.clipboard.writeText(texto);
  },

  marcarTudo(seletorContainer, marcado){
    const box = document.querySelector(seletorContainer);
    if(!box) return;
    box.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = marcado);
  },

  salvarChecklist(){
    const box = document.querySelector("#checkMvp");
    const itens = [...box.querySelectorAll("label")].map((lab, idx) => ({
      id: idx + 1,
      texto: lab.innerText.trim(),
      ok: lab.querySelector("input").checked
    }));
    localStorage.setItem(this.chaveChecklist, JSON.stringify(itens, null, 2));
    alert("Checklist salvo!");
  },

  carregarChecklist(){
    const bruto = localStorage.getItem(this.chaveChecklist);
    if(!bruto) return;
    try{
      const itens = JSON.parse(bruto);
      const labels = document.querySelectorAll("#checkMvp label");
      itens.forEach((it, i) => {
        const ck = labels[i]?.querySelector("input");
        if(ck) ck.checked = !!it.ok;
      });
    }catch(e){}
  },

  coletarLacunas(){
    const v = (id) => (document.getElementById(id)?.value || "").trim();
    const c = (id) => !!document.getElementById(id)?.checked;

    return {
      score_minimo: v("lac_score_min"),
      competencia_critica: v("lac_critica"),
      formatos_curriculo: v("lac_formatos"),
      tamanho_max_arquivo: v("lac_tamanho"),
      retencao_dados: v("lac_retencao"),
      verificacao_empresa: v("lac_verificacao"),
      texto_consentimento_lgpd: v("lac_consentimento"),
      pesos_ranking: v("lac_pesos"),
      etapas_mvp: {
        agendar_entrevista: c("lac_etapa_entrevista"),
        teste_tecnico: c("lac_etapa_teste"),
        mensagens_na_plataforma: c("lac_etapa_msg"),
      },
      atualizado_em: new Date().toISOString()
    };
  },

  salvarLacunas(){
    const dados = this.coletarLacunas();
    localStorage.setItem(this.chaveLacunas, JSON.stringify(dados, null, 2));
    this.atualizarPreview();
    alert("Lacunas salvas!");
  },

  carregarLacunas(){
    const bruto = localStorage.getItem(this.chaveLacunas);
    if(!bruto) return;
    try{
      const d = JSON.parse(bruto);
      const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ""; };
      const b = (id, val) => { const el = document.getElementById(id); if(el) el.checked = !!val; };

      s("lac_score_min", d.score_minimo);
      s("lac_critica", d.competencia_critica);
      s("lac_formatos", d.formatos_curriculo);
      s("lac_tamanho", d.tamanho_max_arquivo);
      s("lac_retencao", d.retencao_dados);
      s("lac_verificacao", d.verificacao_empresa);
      s("lac_consentimento", d.texto_consentimento_lgpd);
      s("lac_pesos", d.pesos_ranking);

      b("lac_etapa_entrevista", d.etapas_mvp?.agendar_entrevista);
      b("lac_etapa_teste", d.etapas_mvp?.teste_tecnico);
      b("lac_etapa_msg", d.etapas_mvp?.mensagens_na_plataforma);
    }catch(e){}
  },

  atualizarPreview(){
    const dados = this.coletarLacunas();
    const pre = document.getElementById("jsonPreview");
    if(pre) pre.textContent = JSON.stringify(dados, null, 2);
  },

  copiarJson(){
    const pre = document.getElementById("jsonPreview");
    navigator.clipboard.writeText(pre?.textContent || "{}");
  },

  exportarJson(){
    const dados = this.coletarLacunas();
    const blob = new Blob([JSON.stringify(dados, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "lacunas_projeto.json";
    a.click();

    URL.revokeObjectURL(url);
  }
};

window.addEventListener("load", () => {
  app.init();

  // Atualiza preview ao digitar
  document.querySelectorAll("#lacunas input, #lacunas textarea").forEach(el => {
    el.addEventListener("input", () => app.atualizarPreview());
    el.addEventListener("change", () => app.atualizarPreview());
  });
});