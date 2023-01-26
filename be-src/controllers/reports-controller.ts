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
