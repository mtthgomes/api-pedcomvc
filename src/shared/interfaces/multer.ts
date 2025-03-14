export interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string; // ✅ Adicionado mimetype
}