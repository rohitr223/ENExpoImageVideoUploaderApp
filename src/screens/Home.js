import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Uploading from "../components/Uploading";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { storage, db } from "../../firebaseConfig";
import { Video } from "expo-av";

const Home = () => {
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New File", change.doc.data());
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // upload the image
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  const uploadImage = async (uri, fileType) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // list for events
    uploadTask.on(
      "state-changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Progress", progress);
        setProgress(progress.toFixed());
      },
      (err) => {
        Alert.alert("Uploading Failed", err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save the records
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          setVideo("");
        });
      }
    );
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      // upload the video
      await uploadVideo(result.assets[0].uri, "video");
    }
  };

  const uploadVideo = async (uri, fileType) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // list for events
    uploadTask.on(
      "state-changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Progress", progress);
        setProgress(progress.toFixed());
      },
      (err) => {
        Alert.alert("Uploading Failed", err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save the records
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setVideo("");
        });
      }
    );
  };

  // Save the record in database
  const saveRecord = async (fileType, url, createdAt) => {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("Document saved successfully!", docRef.id);
    } catch (err) {
      Alert.alert("Failed", err.message);
    }
  };

  const deleteImageVideos = () => {
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        numColumns={3}
        contentContainerStyle={{ gap: 2 }}
        columnWrapperStyle={{ gap: 2 }}
        data={files}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => {
          if (item.fileType === "image") {
            return <Image source={{ uri: item.url }} style={styles.image} />;
          } else {
            return (
              <Video
                source={{ uri: item.url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                //isLooping
                useNativeControls
                style={styles.video}
              />
            );
          }
        }}
      />
      {image && <Uploading image={image} video={video} progress={progress} />}
      <TouchableOpacity onPress={pickVideo} style={styles.pickVideoBtn}>
        <Ionicons name="videocam" color="#FFF" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} style={styles.pickImageBtn}>
        <Ionicons name="image" color="#FFF" size={30} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  image: {
    width: "34%",
    height: 100,
    margin: 5,
  },
  video: {
    width: "34%",
    height: 100,
    margin: 5,
  },
  pickVideoBtn: {
    position: "absolute",
    bottom: 140,
    right: 30,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickImageBtn: {
    position: "absolute",
    bottom: 70,
    right: 30,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
