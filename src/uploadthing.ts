import { createUploadthing, type FileRouter } from "uploadthing/express";
import { saveFileLinkToPatient } from "./services/uploadService";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

interface UploadMetadata {
  patientCpf: string;
}

export const ourFileRouter = {
  fileUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
    pdf: {
      maxFileSize: "1GB",
      maxFileCount: 10,
    },
  })
    .middleware(({ req }) => {
      const { cpf } = req.body;

      if (!cpf) {
        throw new UploadThingError("CPF do paciente é obrigatório.");
      }

      console.log("Middleware: CPF recebido - ", cpf);
      return { patientCpf: cpf };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete: Dados recebidos - ", file);

      if (metadata) {
        const { patientCpf } = metadata as UploadMetadata;

        console.log("Upload complete: CPF associado - ", patientCpf);

        if (patientCpf) {
          await saveFileLinkToPatient(patientCpf, file.url);
          return { uploadedBy: patientCpf, url: file.url }
        } else {
          console.error('Erro: CPF do paciente ausente.');
        }
      } else {
        console.error('Erro: Metadata está indefinido.');
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
