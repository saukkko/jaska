import fetch from "node-fetch";
import { Interaction } from "discord.js";

export class Commands {
  public static async getZoomLinkByRealizationCode(
    interaction: Interaction
  ): Promise<void | undefined> {
    if (!interaction.isCommand()) {
      return;
    } else {
      const url = new URL("https://lukkarit.laurea.fi/rest/realization/");

      let code = "";
      if (typeof interaction.options.data[0].value === "string") {
        code = interaction.options.data[0].value;
      }
      if (!code || code === "") return;
      url.pathname = url.pathname.concat(code.toUpperCase());

      // fetch response
      const res = await fetch(url.href);

      // check that JSON.parse() returns no errors
      try {
        res
          .json()
          .then((data: Realization) => {
            if (!data.events) return interaction.reply("No events");
            return interaction.reply(
              this.trimRealizationEvents(findEvent(data.events))
            );
          })
          .catch((err) => {
            console.error(err);
            return interaction.reply("error while trimming data");
          });
      } catch (err) {
        console.error(err);
        return interaction.reply("Error");
      }

      const findEvent = (
        events: RealizationEvent[]
      ): RealizationEvent | undefined => {
        const now = new Date().toISOString().slice(0, 10);

        console.log(now);
        console.log(events[1]);
        return events.find((e) => now.startsWith(e.start_date.slice(0, 10)));
      };
    }
  }

  private static trimRealizationEvents(obj?: RealizationEvent): string {
    if (typeof obj === "undefined") return "";
    const { subject, start_date, end_date, externalLocation } = obj;
    const trimmed = `\nKurssi: ${subject}\nAlkaa: ${start_date}\nLoppuu: ${end_date}\nTila: ${externalLocation.name}\nLinkki: ${externalLocation.url}`;

    return trimmed;
  }

  //#region not in use
  // these methods needs more work and also to be registered. so don't call them at all for now

  private getRealization(interaction: Interaction): Promise<void> | undefined {
    if (interaction.isCommand()) {
      const url = "https://lukkarit.laurea.fi/rest/realization/";

      let course_code = "";
      course_code = interaction.options.data[0].value?.toString() || "";

      if (course_code && course_code !== "") {
        course_code = course_code.toUpperCase();

        // this will crash bot if input is invalid
        fetch(url + course_code)
          .then((res) => res.json())
          .catch((err) => {
            console.error(err);
            return interaction.reply("Error");
          })
          .then((data: Realization) => {
            return interaction.reply(this.trimRealization(data));
          })
          .catch((err) => {
            console.error(err);
            return interaction.reply("Error");
          });
      }
    }
    return;
  }

  private findRealizations(
    interaction: Interaction
  ): Promise<void> | undefined {
    if (!interaction.isCommand()) return;
    const url = "https://lukkarit.laurea.fi/rest/realizations/";
    const method = "POST";

    let course_code = "";
    course_code = interaction.options.data[0].value?.toString() || "";

    if (course_code && course_code !== "") {
      course_code = course_code.toUpperCase();

      // this currently might crash the bot if input is invalid
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
        .catch((err) => {
          console.error(err);
          return interaction.reply("Error");
        })
        .then((data: Realizations) => {
          return interaction.reply(this.trimSearchResults(data));
        })
        .catch((err) => {
          console.error(err);
          return interaction.reply("Error");
        });
    }

    return;
  }

  private trimSearchResults(obj: Realizations): string {
    let trimmed = ``;
    obj.data.map((d, i) => {
      trimmed += `\n${i + 1}: ${d.code}, ${d.name}, ${d.office}`;
    });
    return trimmed;
  }

  private trimRealization(obj: Realization): string {
    const trimmed = `\nKoodi: ${obj.code}\nNimi: ${obj.name}\nOpettaja: ${obj.teacher}\nKurssi alkaa: ${obj.start_date}\nKurssi päättyy: ${obj.end_date}\nIlmoittautumisaika: ${obj.enrollment_start_date} - ${obj.enrollment_end_date}\nLisätiedot:\n${obj.further_information}\n\nLinkki toteutukseen: ${obj.realization_link}`;
    return trimmed;
  }
  //#endregion
}

type RealizationEvent = {
  event_id: number;
  start_date: string;
  end_date: string;
  code: string[];
  subject: string;
  externalLocation: {
    name: string;
    url: string;
  };
  reserved_for: string[];
  student_groups: string[];
};

type Realizations = {
  data: [
    {
      name: string;
      code: string;
      office: string;
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
  events?: RealizationEvent[]; // [Record<string, never>];
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
