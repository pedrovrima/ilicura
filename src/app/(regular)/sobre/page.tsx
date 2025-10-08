export default function Sobre() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f1e4ca] text-secondary">
      <div className="container mt-8 px-4 py-16">
        <h1 className="mb-6 text-center text-4xl font-extrabold tracking-tight text-secondary-foreground sm:text-5xl">
          Sobre o <span className="text-primary">WikiMudas</span>
        </h1>

        <section
          id="sobre-wikimudas"
          className="mx-auto max-w-3xl space-y-4 text-black"
        >
          <p>
            O Wikimudas é uma iniciativa do Observatório de Aves da Mantiqueira
            (OAMa) destinada a sistematizar e compartilhar informações e
            conhecimentos sobre estratégias de muda e determinação de idade de
            aves brasileiras, com base no sistema WRP (Wolfe-Ryder-Pyle) de
            classificação de idade. Esse projeto foi realizado com o apoio do
            CRBio-04 e financiado majoritariamente pelo doadores recorrentes do
            OAMa (torne-se um apoidor clicando{" "}
            <a
              href="https://oama.eco.br/apoie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              aqui
            </a>
            ).
          </p>

          <p>
            A correta determinação da idade de aves é um fator crítico para
            garantir a qualidade e a utilidade dos dados de anilhamento em
            estudos diversos, em especial os focados em ecologia de populações.
            Apesar disso, o uso do sistema WRP para a classificação de idade de
            aves ainda é incipiente no Brasil. Um principal fator para essa
            baixa adesão à este sistema de classificacao de idade mais
            especifico é a limitada disseminação de informações práticas e
            atualizadas para aplicação dos conceitos teóricos. O Wikimudas
            propõe-se a reduzir essa lacuna, tornando os informações de base
            para identificação das mudas e plumagens das aves mais acessível.
            Visamos estimular a aplicação do conhecimento sobre mudas e
            plumagens nos ornitologicos e promover maior consistência nos
            registros de idade das aves do Brasil.
          </p>

          <p>
            Nesta fase inicial, a plataforma organiza e disponibiliza dados
            empíricos obtidos pelo OAMa na Serra da Mantiqueira. O objetivo é
            que, em um futuro próximo, outros pesquisadores e programas de
            monitoramento possam cadastrar informações obtidas em suas
            pesquisas, ampliando o número de espécies contempladas e a
            representatividade geográfica dos dados.
          </p>

          <p>
            As informações aqui apresentadas estão estruturadas de maneira
            similar aos guias de Peter Pyle e de Johnson &amp; Wolfe, principais
            referências sobre muda e determinação de idade de aves para o
            hemisfério ocidental e o contexto neotropical.
          </p>

          <p>
            Para mais informações sobre o sistema WRP, recomenda-se a consulta
            às seguintes publicações:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              <em>Identification Guide to North American Birds, Part I</em> —{" "}
              <strong>Peter Pyle</strong>
            </li>
            <li>
              <em>Identification Guide to North American Birds, Part II</em> —{" "}
              <strong>Peter Pyle</strong>
            </li>
            <li>
              <em>
                Molt in Neotropical Birds: Life History and Aging Criteria
              </em>{" "}
              — <strong>Erik I. Johnson &amp; Jared D. Wolfe</strong>
            </li>
            <li>
              <em>Manual de Anilhamento de Aves Silvestres</em> —{" "}
              <strong>ICMBio / CEMAVE</strong>
            </li>
          </ul>
          <h3 className="mt-8 text-2xl font-bold text-secondary-foreground">
            Referências bibliográficas
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Pyle, P.</strong> (1997).{" "}
              <em>
                Identification Guide to North American Birds, Part I: Columbidae
                to Ploceidae
              </em>
              . Slate Creek Press, Bolinas, California.
            </li>
            <li>
              <strong>Pyle, P.</strong> (2008).{" "}
              <em>
                Identification Guide to North American Birds, Part II: Anatidae
                to Alcidae
              </em>
              . Slate Creek Press, Bolinas, California.
            </li>
            <li>
              <strong>Pyle, P.</strong> (2022).{" "}
              <em>
                Identification Guide to North American Birds, Part I – Second
                Edition
              </em>
              . Slate Creek Press, Bolinas, California.
            </li>
            <li>
              <strong>Johnson, E. I. &amp; Wolfe, J. D.</strong> (2018).{" "}
              <em>
                Molt in Neotropical Birds: Life History and Aging Criteria
              </em>
              . CRC Press, Boca Raton.
            </li>
            <li>
              <strong>
                ICMBio – Centro Nacional de Pesquisa e Conservação de Aves
                Silvestres (CEMAVE).
              </strong>{" "}
              (2024). <em>Manual de Anilhamento de Aves Silvestres</em>, 3ª
              edição. Instituto Chico Mendes de Conservação da Biodiversidade,
              Brasília.
            </li>
          </ul>

          <h3 className="mt-8 text-2xl font-bold text-secondary-foreground">
            Equipe
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Pedro Martins</strong> — Idealizador e desenvolvedor do
              produto
            </li>
            <li>
              <strong>Luiza Figueira</strong> — coordenadora de execução e
              colaboradora de conteúdo
            </li>
            <li>
              <strong>Danielle Santos</strong> — colaboradora de conteúdo
            </li>
            <li>
              <strong>Natália Almeida</strong> — colaboradora de conteúdo
            </li>
            <li>
              <strong>Rachel Fidelis</strong> — colaboradora de conteúdo
            </li>
            <li>
              <strong>Andreza Freitas</strong> — colaboradora de conteúdo
            </li>
            <li>
              <strong>Victor Sanchez</strong> — colaborador de conteúdo
            </li>
            <li>
              <strong>Affonso Souza</strong> — apoio desenvolvimento de projeto
            </li>
            <li>
              <strong>Veronica Battezini</strong> — apoio desenvolvimento de
              projeto
            </li>
          </ul>

          <h3 className="mt-8 text-2xl font-bold text-secondary-foreground">
            Como citar
          </h3>
          <p>
            WikiMudas - plataforma de conhecimento sobre mudas e idade em aves
            do Brasil por Observatório de Aves da Mantiqueira - acessado online
            em dd/mm/aaaa.
          </p>
        </section>
      </div>
    </main>
  );
}
