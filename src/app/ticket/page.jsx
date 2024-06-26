"use client";
import React from "react";
import { useState, useEffect } from "react";
import Lines from "../../components/Lines";
import Timer from "../../components/Timer";
import { supabaseUrl, supabaseKey } from "../../lib/setttings.js";
import { redirect } from "next/navigation";

export default function Ticket() {
  const [regTickets, setRegTickets] = useState(0);
  const [vipTickets, setVipTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [campSitePick, setCampSitePick] = useState("");
  const [tent1, setTent1] = useState(0);
  const [tent2, setTent2] = useState(0);
  const [green, setGreen] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [reservationId, setReservationId] = useState(false);
  const [resId, setResId] = useState();
  const [totalPrice, setTotalPrice] = useState(99);
  const [newPage, setNewPage] = useState(false);

  //might use:
  const [oldValue] = useState();
  const [bookingInfo, setBookingInfo] = useState({});
  const [info, setInfo] = useState();

  async function getAvailability() {
    const res = await fetch("https://mature-insidious-monitor.glitch.me/available-spots");
    const availability = await res.json();
    setAvailability(availability);
  }
  useEffect(() => {
    getAvailability();
  }, []);
  console.log(availability);
  function pickSite(e) {
    setCampSitePick(e.target.value);
  }

  useEffect(() => {
    setTotalPrice(() => {
      if (green && tent1 && tent2) {
        const newPrice = 99 + regTickets * 799 + vipTickets * 1299 + 249 + tent1 * 299 + tent2 * 399;
        return newPrice;
      }
      if (green) {
        const newPrice = 99 + regTickets * 799 + vipTickets * 1299 + 249;
        return newPrice;
      }
      if (tent1 && tent2) {
        const newPrice = 99 + regTickets * 799 + vipTickets * 1299 + tent1 * 299 + tent2 * 399;
        return newPrice;
      }
      const newPrice = 99 + regTickets * 799 + vipTickets * 1299;
      return newPrice;
    });
  }, [regTickets, vipTickets, green, tent1, tent2]);

  function makeReservation() {
    setReservationId(true);
    getReservation();
  }

  async function getReservation() {
    const response = await fetch("http://localhost:8080/reserve-spot", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        area: campSitePick,
        amount: regTickets,
      }),
    });

    const data = await response.json();
    setResId(data.id);
  }

  //async function completeReservation() {
  // samle data op fra formen via formdata som i recipies
  //kalde den funktion som sender data til supabase
  //sendInfoSupabase(object med med form data)
  // redirect = /endpoint det kan i finde mere om på nextjs docs
  //    const formData = new FormData(form); - måske}

  //async function sendInfoSupabase(data) {
  //sætter i ind fra create recipies og retter til}

  async function completeReservation(e) {
    e.preventDefault();
    // ^e
    const formData = new FormData(e.target);

    const bookingInfo = {
      name: formData.get("fname"),
      surname: formData.get("lname"),
      email: formData.get("email"),
      phone: formData.get("phonenumber"),
      // Add other relevant reservation details if needed
    };
    await fetch(supabaseUrl, {
      method: "POST",
      //laver objekttil string
      body: JSON.stringify(bookingInfo),
      headers: {
        Accept: "application/json",
        apikey: supabaseKey,
        prefer: "return=representation",
        "Content-Type": "application/json",
      },
    });
    setNewPage(true);
  }
  if (newPage) {
    redirect("/endpage");
  }

  return (
    <section className="text-breads text-white uppercase">
      <section>
        <h1 className="text-headers pt-20 justify-self-end pb-8">Tickets</h1>
        <div className="flex gap-x-3 pb-3 text-links">
          <p>regular tickets 799dkk</p>
          <button
            onClick={() => {
              setRegTickets((o) => o - 1);
            }}
          >
            -
          </button>
          <p>{regTickets}</p>
          <button
            onClick={() => {
              setRegTickets((o) => o + 1);
            }}
          >
            +
          </button>
        </div>

        <div className="flex gap-x-3 pb-3 text-links">
          <p className="justify-self-end">vip tickets 1299dkk</p>
          <button
            onClick={() => {
              setVipTickets((o) => o - 1);
            }}
          >
            -
          </button>
          <p>{vipTickets}</p>
          <button
            onClick={() => {
              setVipTickets((o) => o + 1);
            }}
          >
            +
          </button>
        </div>

        <Lines />

        <div>
          <h1 className="text-headers pt-8 justify-self-end">Camping</h1>
          <p className="text-links py-3 pb-8">where you stayin?</p>

          {availability.map((oneSite) => {
            return (
              <div className="grid grid-cols-2 pt-5" key={oneSite.area}>
                <input type="radio" name="camps" value={`${oneSite.area}`} onChange={pickSite}></input>
                <div className="col-start-2">
                  <p>{oneSite.area}</p>
                  <p>{oneSite.available}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Lines />

      <section>
        <article>
          <div>
            <h1 className="text-headers pt-8 justify-self-end">choose tents</h1>
            <p className="text-links pt-3">want a tent with that?</p>
            <p className="py-3 pb-8">you can only choose up to {totalTickets} tents</p>
            <div className="flex gap-x-3 pb-3">
              <p> 2 person tent (including the tent) 299DKK</p>
              <button
                onClick={() => {
                  setTent1((o) => o - 1);
                }}
              >
                -
              </button>
              <p>{tent1}</p>
              <button
                onClick={() => {
                  setTent1((o) => o + 1);
                }}
              >
                +
              </button>
            </div>
            <div className="flex gap-x-3">
              <p> 3 person tent (including the tent) 399DKK</p>
              <button
                onClick={() => {
                  setTent2((o) => o - 1);
                }}
              >
                -
              </button>
              <p>{tent2}</p>
              <button
                onClick={() => {
                  setTent2((o) => o + 1);
                }}
              >
                +
              </button>
            </div>
          </div>

          <Lines />

          <div>
            <h1 className="text-headers py-8 justify-self-end">green camping</h1>
            <div className="flex gap-x-3 pb-3">
              <p> Green camping 249DKK</p>

              <button
                type="radio"
                onClick={() => {
                  setGreen(true);
                }}
              >
                add
              </button>
            </div>
          </div>

          <Lines />

          <div>
            <h1 className="text-headers pt-8 justify-self-end pb-8">cart</h1>
            <div className="grid gap-x-12">
              <p>Regular ticket</p>
              <p className="justify-self-end">..... {regTickets}</p>
            </div>

            <div className="grid gap-x-12">
              <p>vip ticket</p>
              <p className="justify-self-end">..... {vipTickets}</p>
            </div>

            <div className="grid gap-x-12">
              <p>chosen campsite</p>
              <p className="justify-self-end">..... {campSitePick}</p>
            </div>

            <div className="grid gap-x-12">
              <p>2 person tent</p>
              <p className="justify-self-end">..... {tent1}</p>
            </div>

            <div className="grid gap-x-12">
              <p>3 person tent</p>
              <p className="justify-self-end">..... {tent2}</p>
            </div>

            <div className="grid gap-x-12">
              <p>Green camping</p>
              <div className="justify-self-end flex gap-x-1">.....{green ? <p>1</p> : <p>0</p>}</div>
            </div>

            <div className="grid gap-x-12">
              <p>fixed booking fee</p>
              <p className="justify-self-end">..... 1</p>
            </div>

            <div className="grid gap-x-12">
              <p>total price</p>
              <p className="justify-self-end">..... {totalPrice}</p>
            </div>

            <button className="text-links uppercase pt-8 hover:underline" onClick={makeReservation}>
              looks right?
            </button>
          </div>

          <Lines />

          <h1 className="text-headers pt-8 justify-self-end">info</h1>
          {reservationId && <Timer reservationId={reservationId} />}
          <form onSubmit={completeReservation}>
            <fieldset>
              <div className="grid gap-x-3 py-2">
                <label htmlFor="firstname">first name:</label>
                <input className="text-fooBlue" type="text" name="fname" id="firstname" />
              </div>

              <div className="grid gap-x-3 py-2">
                <label htmlFor="surname">surname:</label>
                <input className="text-fooBlue" type="text" name="lname" id="surname" />
              </div>

              <div className="grid gap-x-3 py-2">
                <label htmlFor="email">email:</label>
                <input className="text-fooBlue " type="email" name="email" id="email" />
              </div>
              <div className="grid gap-x-3 py-2">
                <label htmlFor="phonenumber">phonenumber:</label>
                <input className="text-fooBlue " type="text" name="phonenumber" id="phonenumber" />
              </div>
            </fieldset>

            <Lines />

            <h1 className="text-headers pt-8 justify-self-end">payment</h1>

            <fieldset>
              <div className="grid gap-x-3 py-2">
                <label>card number:</label>
                <input className="text-fooBlue" type="text" />
              </div>

              <div className="grid gap-x-3 py-2">
                <label>registration number:</label>
                <input className="text-fooBlue" type="text" />
              </div>

              <div className="grid gap-x-3 py-2">
                <label>name on card:</label>
                <input className="text-fooBlue " type="text" />
              </div>
              <div className="grid gap-x-3 py-2 pb-10">
                <label>cvc:</label>
                <input className="text-fooBlue " type="text" />
              </div>
            </fieldset>
            <button className="text-links  justify-self-end hover:underline">complete purchase</button>
          </form>
        </article>
      </section>
    </section>
  );
}
