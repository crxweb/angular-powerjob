// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDykkT5HnaHbEpyK_IBniTxpuaCabQUgOw",
    authDomain: "power-job.firebaseapp.com",
    databaseURL: "https://power-job.firebaseio.com",
    projectId: "power-job",
    storageBucket: "power-job.appspot.com",
    messagingSenderId: "786423381052"
  },
  app_config: {
    storage_max_file_size: 2 * 1024 *1024,
    test_storage_upload_path: "test",
    test_storage_upload_prefix: "test",

    avatar_storage_upload_path: "avatar",
    avatar_storage_upload_prefix: "avatar",
    default_storage_avatar_name: "default-profile_picture.jpg",
    
    bibliotheque: {
      image_thumb_size_list: 90,
      types_document: [ "CV" , "Lettre de motivation", "Candidature spontanée" , "Pièce d'identité" ]
    },   
    firestore: {
      collection: {
        bibliotheque: "users_bibliotheque",
        users: "users"
      }
    },
    upload_config: {
      path: {
        bibliotheque: "bibliotheque/",
        upload: "upload/"
      },
      max_file_size: {
        bibliotheque: 10 * 1024 * 1024,
        upload: 2 * 1024 * 1024
      },
      mime_type_allowed: {
        bibliotheque: [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/zip",
          "application/vnd.ms-excel",
          "application/msword",
          "application/vnd.ms-powerpoint",
          "application/vnd.oasis.opendocument.text",
          "application/vnd.oasis.opendocument.spreadsheet",
          "application/vnd.oasis.opendocument.presentation",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "video/mpeg",
          "video/mp4",
          "video/x-flv",
          "audio/mpeg"
        ],
        upload: [
          "image/jpeg","image/png",
          "application/pdf",
          "application/zip",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
      },
      mime_accept_allowed: {
        bibliotheque: [".png",".jpg",".jpeg",".zip", "."]
      }
    }
  }
};
