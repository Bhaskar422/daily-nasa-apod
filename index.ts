import { writeFile } from "fs/promises";

interface APODData {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

async function fetchAPOD(): Promise<APODData> {
  try {
    const apiKey = process.env.NASA_API_KEY;
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = await response.json();
    console.log("data", data);
    return data as APODData;
  } catch (error) {
    console.error("Error fetching APOD:", error);
    throw error;
  }
}

async function fetchNeoWs() {
  try {
    const apiKey = process.env.NASA_API_KEY;
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`
    );
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching NEO data:", error);
    throw error;
  }
}

const currendDate = new Date();
const day = currendDate.getDate();
let daySuffix;
if (day === 1 || day === 21 || day === 31) {
  daySuffix = "st";
} else if (day === 2 || day === 22) {
  daySuffix = "nd";
} else if (day === 3 || day === 23) {
  daySuffix = "rd";
} else {
  daySuffix = "th";
}

const updateReadme = async (data: APODData) => {
  const formattedDate = `${day}${daySuffix} ${currendDate.toLocaleString("default", {
    month: "long",
  })} ${currendDate.getFullYear()}`;
  const readme = `# NASA Astronomy Picture of the Day (APOD) for - ${formattedDate}

        ## ${data.title}

        ![${data.title}](${data.url})

        ### Description
        ${data.explanation}

        ---

        *Last updated: ${new Date().toLocaleDateString()}*

        > This README is automatically updated with the latest NASA Astronomy Picture of the Day.
        > 
        > **High Resolution Image:** [View Full Size](${data.hdurl})
        > 
        > **Media Type:** ${data.media_type}
        `;
  await writeFile("README.md", readme, "utf-8");
};

const main = async () => {
  try {
    const data: APODData = await fetchAPOD();
    await updateReadme(data);
  } catch (error) {
    console.error(error);
  }
};

main();
// fetchNeoWs();
