import { cloudinary } from "../lib/cloudinary";
// import { Pet } from "../models";
import { Report } from "../models";
import { User } from "../models";
import { index } from "../lib/algolia";
export async function createReport(userId, data) {
  if (data.petImage) {
    console.log("data del createReport-controller", userId, data);
    const imagen = await cloudinary.uploader.upload(data.petImage, {
      resource_type: "image",
      discard_original_filename: true,
      width: 100,
    });
    console.log({ imagen });
    const petCreated = await Report.create({
      petName: data.petName,
      petImage: imagen.secure_url,
      location: data.location,
      ownerEmail: data.ownerEmail,
      lat: data.lat,
      lng: data.lng,
      commentary: data.commentary,
      user_id: userId,
    });
    console.log("petCreated despues del controller linea 24", petCreated);
    const petId = await petCreated.get("id");
    const algoliaPet = await index
      .saveObject({
        petName: data.petName,
        petImage: imagen.secure_url,
        location: data.location,
        ownerEmail: data.ownerEmail,
        creado: "si",
        _geoloc: {
          lat: data.lat,
          lng: data.lng,
        },
        objectID: petId,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((e) => {
        console.log(e);
      });

    return petCreated;
  } else {
    return { message: "no hay petimage" };
  }
}
export async function allReports() {
  const data = await Report.findAll({});
  return data;
}
export async function unReporte(number: number) {
  const usersReports = await Report.findAll({
    where: {
      user_id: number,
    },
  });
  return usersReports;
}

export async function actulizarReport(data, id, userId: number) {
  const objetoDeData = data;

  let object: any = {};
  let objectToAlgolia: any = {};

  const array = Object.values(data);
  if (data.newPetImage) {
    const imagen = await cloudinary.uploader.upload(data.newPetImage, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    object.petImage = imagen.secure_url;
    objectToAlgolia.petImage = imagen.secure_url;
  }
  if (data.newCommentary) {
    object.commentary = array[3];
  }

  if (data.newLocation) {
    object.location = array[4];
    objectToAlgolia.location = array[4];
  }

  if (data.newPetLat && data.newPetLng) {
    object.lat = array[5];
    object.lng = array[6];
    objectToAlgolia._geoloc = { lat: array[5], lng: array[6] };
  }

  if (data.newPetName) {
    object.petName = array[1];
    objectToAlgolia.petName = array[1];
  }

  console.log("object", object);
  console.log("objectAlgolia", objectToAlgolia);
  const updatedReport = await Report.update(object, {
    where: { id },
  });
  console.log("updatedReport", updatedReport);
  objectToAlgolia.objectID = id;
  const algoliaPet = await index
    .partialUpdateObject(objectToAlgolia)
    .then((e) => {
      console.log("ya se hizo el partialupdateobject", e);
    })
    .catch((e) => {
      console.log("salio mal");
    });

  return updatedReport;
}
export async function deletePet(idReport: number) {
  const objectID = `${idReport}`;

  try {
    const mascotFound = await Report.findByPk(idReport);
    await mascotFound.destroy();
    await index.deleteObject(objectID);

    return true;
  } catch (e) {
    console.error(e, "algo salio mal");
  }
}
export async function reportesCerca(myLat, myLng) {
  const { hits } = await index
    .search("", {
      aroundLatLng: [myLat, myLng].join(","),
      aroundRadius: 20000,
    })
    .catch((error) => {
      console.log(error);

      return error;
    });
  if (hits) {
    return hits;
  }
}
