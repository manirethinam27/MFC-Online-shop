
const Home = () =>{


    return(
        <>
              <h2 className="text-xl font-semibold mb-4">
                Welcome 👋
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow">
                  <p className="text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">120</p>
                </div>

                <div className="p-4 bg-white rounded shadow">
                  <p className="text-gray-500">Today Revenue</p>
                  <p className="text-2xl font-bold">₹4,560</p>
                </div>

                <div className="p-4 bg-white rounded shadow">
                  <p className="text-gray-500">Pending Orders</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </>
    );
}

export default Home;