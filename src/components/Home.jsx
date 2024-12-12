import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import male from "../assets/male.png";
import female from "../assets/female.png";

const Home = () => {
  // Bu yerdagi useStatelar ma'lumotlarni boshqarish uchun kerak
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  const [gender, setGender] = useState("male");
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // Apidan ma'lumotni olish uchun
  useEffect(() => {
    axios.get("http://localhost:3001/post").then((res) => setData(res));
  }, [reload]);


  // ma'lumotlarni yaratish uchun
  const handleCreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const post = Object.fromEntries(formData);
    post.gender = gender;

    //editMode true boladigan bolsa ushbu kod ishlaydi
    if (editMode) {
      axios
        .put(`http://localhost:3001/post/${currentPostId}`, post)
        .then(() => {
          setReload((i) => !i);
          e.target.reset();
          setEditMode(false);
          setCurrentPostId(null);
        });
        //aks holda bu
    } else {
      axios.post("http://localhost:3001/post", post).then(() => {
        e.target.reset();
        setReload((i) => !i);
      });
    }
  };


  //ma'lumotni o'chirish uchun kerak
  const hanldeDeletePost = (id) => {
    axios.delete(`http://localhost:3001/post/${id}`).then(() => {
      setReload((i) => !i);
    });
  };


  // malumotni taxrirlash uchun kerak
  const handleEditPost = (post) => {
    setEditMode(true);
    setCurrentPostId(post.id);
    setGender(post.gender);


    // bosilgan malumotni id siga qarab yuqoridagi formga ma'lumotlarni chiqarish uchun kerak
    const form = document.querySelector("form");
    form.firstname.value = post.firstname;
    form.lastname.value = post.lastname;
    form.age.value = post.age;
    form.email.value = post.email;
    form.phone.value = post.phone;
    form.occupation.value = post.occupation;
  };

  return (
    <div className="mt-10">
      <div className="container__person">
        <div>
          <form
            onSubmit={handleCreatePost}
            className="w-full max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg shadow-md"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstname"
                placeholder="Ismingiz"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Familiyangiz"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="age"
                placeholder="Yoshingiz"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email manzilingiz"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Telefon raqamingiz"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="occupation"
                placeholder="Kasbingiz"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Erkak</option>
              <option value="female">Ayol</option>
            </select>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${editMode ? " bg-green-400 hover:bg-green-600 focus:ring-green-500" : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"}`}
            >
              {editMode ? "Yangilash" : "Yaratish"}
            </button>
          </form>
          <div className="w-full grid grid-cols-3 mt-10 gap-5">
            {data?.data.map((i) => (
              <motion.div
                key={i.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-lg rounded-lg p-6 text-black"
              >
                <div className="flex flex-col items-center mb-4">
                  <motion.img
                    src={i.gender === "male" ? male : female}
                    alt={`${i.firstName} ${i.lastName}`}
                    className="w-32 h-32 rounded-full mb-4"
                    whileHover={{ scale: 1.1 }}
                  />
                  <motion.h2
                    className="text-2xl font-bold text-center"
                    whileHover={{ scale: 1.05, color: "#3498db" }}
                  >
                    {i.firstname} {i.lastname}
                  </motion.h2>
                </div>
                <div className="space-y-2">
                  <InfoItem label="Yosh" value={i.age} />
                  <InfoItem
                    label="Jinsi"
                    value={i.gender === "male" ? "Erkak" : "Ayol"}
                  />
                  <InfoItem label="Email" value={i.email} />
                  <InfoItem label="Telefon" value={i.phone} />
                  <InfoItem label="Kasbi" value={i.occupation} />
                </div>
                <div className="flex justify-between mt-6">
                  <motion.button
                    onClick={() => handleEditPost(i)}
                    whileHover={{ scale: 1.05, backgroundColor: "#2980b9" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FaEdit className="mr-2" /> Tahrirlash
                  </motion.button>
                  <motion.button
                    onClick={() => hanldeDeletePost(i.id)}
                    whileHover={{ scale: 1.05, backgroundColor: "#c0392b" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FaTrash className="mr-2" /> O'chirish
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <motion.div
    className="flex justify-between"
    whileHover={{ scale: 1.02, color: "#3498db" }}
  >
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </motion.div>
);

export default Home;
