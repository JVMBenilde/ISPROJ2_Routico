


export default function ContactUs() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 min-h-screen bg-gradient-to-b from-white to-gray-50">
      
      <h1 className="text-4xl font-extrabold mb-2 text-center">Contact Us</h1>
      <p className="text-center text-gray-600 mb-8 max-w-xl">
        Have questions or need assistance? Reach out to us, and we’ll be happy to help!
      </p>

      <form className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Your Full Name"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          rows={4}
          placeholder="Your Message"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
