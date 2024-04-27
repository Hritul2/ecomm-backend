import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_KEY as string,
    api_secret: process.env.CLOUDINARY_SECRET as string,
});

const uploadOnCloudinary = async (loaclFilePath: string) => {
    try {
        if (!loaclFilePath) {
            return null;
        }

        const resposne = await cloudinary.uploader.upload(loaclFilePath, {
            resource_type: "auto",
        });
        fs.unlinkSync(loaclFilePath);
        return resposne;
    } catch (error: any) {
        fs.unlinkSync(loaclFilePath);
        return null;
    }
};
export default uploadOnCloudinary;
