import fetch from "node-fetch";
import { Message } from "discord.js";

export class Commands {
  /**
   * TODO:
   * 1. Make this class prettier
   *    - Make each command to their own class methods
   *    - tidy up the code
   * 2. Add more commands
   * 3. Add more useful commands
   */
  public init(msg: Message): Promise<Message> | undefined {
    if (msg.content === "?test") {
      return msg.reply("Toimii!");
    }

    if (msg.content.startsWith("?toteutus")) {
      const url = "https://lukkarit.laurea.fi/rest/realization/";
      let course_code = "";
      course_code = msg.content.split(" ")[1];
      if (course_code) {
        course_code = course_code.toUpperCase();
        fetch(url + course_code)
          .then((res) => res.json())
          .then((data: Realization) => {
            console.log(data);

            return msg.reply(this.trimRealization(data));
          });
      }
    }
    if (msg.content.startsWith("?toteutukset")) {
      const url = "https://lukkarit.laurea.fi/rest/realizations/";
      const method = "POST";
      let course_code = "";
      course_code = msg.content.split(" ")[1];
      if (course_code) {
        course_code = course_code.toUpperCase();

        fetch(url, {
          headers: { "Content-Type": "application/json" },
          method: method,
          body: JSON.stringify({
            target: "realization",
            type: "name",
            text: course_code,
          }),
        })
          .then((res) => res.json())
          .then((data: Realizations) => {
            console.log(data);
            this.trimSearchResults(data);
          });
      }
    }
  }
  private trimSearchResults(obj: Realizations): void {
    obj.data.map((o) => console.log(o));
    //const trimmed = ``;
    //return trimmed;
  }

  private trimRealization(obj: Realization): string {
    const trimmed = `\nKoodi: ${obj.code}\nNimi: ${obj.name}\nOpettaja: ${obj.teacher}\nKurssi alkaa: ${obj.start_date}\nKurssi päättyy: ${obj.end_date}\nIlmoittautumisaika: ${obj.enrollment_start_date} - ${obj.enrollment_end_date}\nLisätiedot:\n${obj.further_information}\n\nLinkki toteutukseen: ${obj.realization_link}`;
    return trimmed;
  }
}

type Realizations = {
  data: [
    {
      name: string;
      code: string;
    }
  ];
};

type Realization = {
  code: string; //'R0027-3009'
  name: string; // "Ohjelmoinnin perustaito";
  end_date?: string | Date; //'2021-07-31'
  enrollment_end_date?: string | Date; //'2020-11-29'
  enrollment_start_date?: string | Date; //'2020-11-23'
  evaluation_scale?: string; // 'H-5'
  events?: [Record<string, never>];
  further_information?: string; //'Tällä opintojaksolla opiskellaan ohjelmoinnin perusrakenteita. Aiempaa ohjelmointikokemusta ei tarvita. Tällä opintojaksolla käytetään Java-ohjelmointikieltä.'
  gname?: string; // 'Ohjelmoinnin perustaito'
  learning_material?: string; // "- Opettajan tarjoamat materiaalit Optimassa\r\n- Java MOOC 2019 verkkokurssi\r\n- Verkkolähteet\r\n- oma kannettava tietokone";
  office?: string; // "Laurea Leppävaara";
  realization_link?: string | URL; // "https://ops.laurea.fi/index.php/fi/realization/R0027-3009";
  scope_amount?: string | number; // "5";
  start_date?: string | Date; // "2021-01-01";
  teacher?: string; // "Jukka Malinen";
  teaching_language?: string; // "Suomi"
};
