import { cloudinary } from "../lib/cloudinary";
import { Pet } from "../models";
import { Report } from "../models";
import { User } from "../models";
import { index } from "../lib/algolia";
export async function createPet(userId, data) {
  if (data.petImage) {
    const imagen = await cloudinary.uploader.upload(data.petImage, {
      resource_type: "image",
      discard_original_filename: true,
      width: 100,
    });
    const petCreated = await Pet.create({
      petname: data.petname,
      petImage: imagen.secure_url,
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      founded: data.founded,
      user_id: userId,
    });
    const petId = await petCreated.get("id");
    const algoliaPet = await index
      .saveObject({
        petname: data.petname,
        petImage: imagen.secure_url,
        place: data.place,
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
  }
}
