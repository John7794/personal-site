import Papa from 'papaparse';

// The URLs of the published Google Sheet in CSV format.
// To get these URLs:
// 1. Go to your Google Sheet
// 2. Click File -> Share -> Publish to web
// 3. Choose the specific tab (e.g. "Projects" or "General") and "Comma-separated values (.csv)"
// 4. Click Publish and copy the generated links here.
const PROJECTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0RprQzxAgCdpGEp6LGscCYr9yA8gvyn2TmyX-cS-mQ0iU8NEOh8M_WfmFTCsENa8dpBJcsR_RWQsX/pub?output=csv";
const GENERAL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0RprQzxAgCdpGEp6LGscCYr9yA8gvyn2TmyX-cS-mQ0iU8NEOh8M_WfmFTCsENa8dpBJcsR_RWQsX/pub?output=csv";

export interface SheetProject {
  title: string;
  category: string;
  role: string;
  year: string;
  descriptionUk: string;
  descriptionEn: string;
  image: string;
  link: string;
}

export type TranslationDict = Record<string, { uk: string; en: string }>;

export interface SheetGeneralData {
  photoUrl: string;
  email: string;
  linkedin: string;
  instagram: string;
  translations: TranslationDict;
}

export async function fetchProjectsFromSheet(): Promise<SheetProject[]> {
  // Check if the URL is still the placeholder. If so, return an empty array silently.
  if (PROJECTS_CSV_URL.includes("2PACX-1vTq916iS0rS--N1C1G-E-O-GjO4eU5_o1H_H-y9O1eK0m8-U-_T_V_U_b_1_J_E_R_L_A")) {
    return [];
  }

  try {
    const response = await fetch(PROJECTS_CSV_URL);
    if (!response.ok) {
      console.warn("Failed to fetch Projects CSV: Server returned status", response.status);
      return [];
    }
    const csvData = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Map the CSV headers to our project structure
          const projects = results.data.map((row: any) => {
            let descUk = (row['Description (UK)'] || '').trim();
            let descEn = (row['Description (EN)'] || '').trim();
            
            if (!descUk && descEn) descUk = descEn;
            if (!descEn && descUk) descEn = descUk;

            return {
              title: row['Title'] || '',
              category: row['Category'] || '',
              role: row['Role'] || '',
              year: row['Year'] || '',
              descriptionUk: descUk,
              descriptionEn: descEn,
              image: row['Image URL'] || '',
              link: row['Link'] || '#'
            };
          });
          resolve(projects);
        },
        error: (error: any) => {
          console.error("Error parsing Projects CSV", error);
          reject(error);
        }
      });
    });
  } catch (error) {
    // Suppress verbose error logging to avoid breaking applet status
    return [];
  }
}

export async function fetchGeneralDataFromSheet(): Promise<SheetGeneralData | null> {
  if (GENERAL_CSV_URL.includes("2PACX-1vTq916iS0rS--N1C1G-E-O-GjO4eU5_o1H_H-y9O1eK0m8-U-_T_V_U_b_1_J_E_R_L_A")) {
    return null;
  }

  try {
    const response = await fetch(GENERAL_CSV_URL);
    if (!response.ok) {
      console.warn("Failed to fetch General CSV: Server returned status", response.status);
      return null;
    }
    const csvData = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Expecting columns: Key, Value (UK), Value (EN)
          const data: any = {};
          results.data.forEach((row: any) => {
            const key = row['Key']?.trim();
            if (key) {
              let uk = (row['Value (UK)'] || '').trim();
              let en = (row['Value (EN)'] || '').trim();
              
              // Fallback to the other language if one is empty
              if (!uk && en) uk = en;
              if (!en && uk) en = uk;

              data[key] = { uk, en };
            }
          });

          // Map the found keys to our general data interface
          resolve({
            photoUrl: data['Photo URL']?.uk || data['Photo URL']?.en || '',
            email: data['Email']?.uk || data['Email']?.en || '',
            linkedin: data['LinkedIn']?.uk || data['LinkedIn']?.en || '',
            instagram: data['Instagram']?.uk || data['Instagram']?.en || '',
            translations: data
          });
        },
        error: (error: any) => {
          console.error("Error parsing General CSV", error);
          reject(error);
        }
      });
    });
  } catch (error) {
    return null;
  }
}
