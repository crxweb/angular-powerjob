export interface UserBibliotheque {
    documentAdded?: Date,
    documentUpdated?: Date,
    documentType?: string,
    documentLibelle?: string,
    fileStorageContentType?: string,
    fileStorageFullPath?: string,
    fileStorageName?: string,
    fileStorageOriginalName?: string,
    fileStorageSize?: number
    userId: string;
    uid?: string,
    storage?: {
        type?: string,
        bucket?: string,
        generation?: string,
        metageneration?: string,
        fullPath?: string,
        name?: string,
        size?: number,
        timeCreated?: Date,
        updated?: Date,
        md5Hash?: string,
        contentDisposition?: string,
        contentEncoding?: string,
        contentType?: string,
        customMetadata?: {
          original_filename?: string
        },
        downloadURLs: string[]
    }
}
