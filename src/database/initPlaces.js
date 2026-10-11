import { Place } from "../models/Place.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";

const initialPlaces = [
    { slug: "cerro_monserrate", title: "Cerro Monserrate", category: "Montaña", location: "Bogotá, Colombia", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1720067392108-89b9485aa090?w=800&h=520&fit=crop&auto=format", description: "Un símbolo de Bogotá con sendero, funicular y teleférico, reconocido por su santuario y sus vistas panorámicas de la ciudad.", duration: "2–4 horas", price: "Desde $16.000 COP", altitude: "3.152 m", reviewCount: 2148 },
    { slug: "cartagena_amurallada", title: "Cartagena Amurallada", category: "Patrimonio", location: "Cartagena, Colombia", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1583997052103-b4a1cb974ce5?q=80&w=1200&auto=format&fit=crop", description: "Calles coloniales, plazas y murallas frente al Caribe forman uno de los centros históricos más vibrantes y mejor conservados de Colombia.", duration: "3–5 horas", price: "Recorrido gratuito", altitude: "2 m", reviewCount: 3294 },
    { slug: "valle_del_cocora", title: "Valle del Cocora", category: "Naturaleza", location: "Quindío, Colombia", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1596395819057-e37f55c7de0e?q=80&w=1200&auto=format&fit=crop", description: "Un valle andino de palmas de cera, bosques de niebla y senderos que conectan miradores con la biodiversidad del paisaje cultural cafetero.", duration: "4–6 horas", price: "Desde $10.000 COP", altitude: "2.400 m", reviewCount: 1847 },
    { slug: "mirador_cafetero", title: "Mirador cafetero", category: "Naturaleza", location: "Filandia, Quindío", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop", description: "Un mirador entre cafetales y montañas, ideal para probar café de origen y observar el paisaje andino.", duration: "1–2 horas", price: "Consumo mínimo", altitude: "1.900 m", reviewCount: 341 },
    { slug: "paseo_costero", title: "Paseo costero", category: "Parque", location: "Santa Marta, Colombia", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1200&auto=format&fit=crop", description: "Un recorrido junto al mar con senderos, vistas abiertas y paradas para descubrir la costa caribeña.", duration: "2–3 horas", price: "Gratuito", altitude: "5 m", reviewCount: 276 },
    { slug: "machu_picchu", title: "Machu Picchu", category: "Patrimonio", location: "Cusco, Perú", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1200&auto=format&fit=crop", description: "Ciudadela inca del siglo XV situada entre montañas y bosques nublados. Sus terrazas, templos y senderos muestran una de las expresiones más destacadas del patrimonio andino.", duration: "3–4 horas", price: "Desde S/ 152", altitude: "2.430 m", reviewCount: 1243 },
    { slug: "maldives_beach", title: "Playa Maldivas", category: "Playa", location: "Malé, Maldivas", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop", description: "Una costa de arena clara y aguas cristalinas, ideal para nadar, practicar snorkel o descansar frente al océano Índico.", duration: "Todo el día", price: "Acceso libre", altitude: "0 m", reviewCount: 892 },
    { slug: "louvre", title: "Museo del Louvre", category: "Museo", location: "París, Francia", rating: 4.7, imageUrl: "https://4.bp.blogspot.com/-WRjy3L5mWWw/VlWIxn8KkVI/AAAAAAAAACo/g50ctsdSRC8/s1600/museo-del-louvre_5801441.jpg", description: "Uno de los museos más visitados del mundo, con colecciones que recorren miles de años de arte, historia y patrimonio cultural.", duration: "3–5 horas", price: "Desde €22", altitude: "35 m", reviewCount: 2134 },
    { slug: "swiss_alps", title: "Alpes Suizos", category: "Montaña", location: "Interlaken, Suiza", rating: 4.9, imageUrl: "https://www.postposmo.com/wp-content/uploads/2020/10/alpes-suizos-18.jpg", description: "Una región montañosa con senderos, lagos y miradores que conectan pueblos alpinos con panorámicas de cumbres nevadas.", duration: "4–6 horas", price: "Desde CHF 45", altitude: "2.061 m", reviewCount: 1678 },
    { slug: "central_park", title: "Central Park", category: "Parque", location: "Nueva York, EE. UU.", rating: 4.6, imageUrl: "https://park.marmaranyc.com/hs-fs/hubfs/Explore%20Widget/Central%20Park.jpg?width=2000&height=1333&name=Central%20Park.jpg", description: "Un gran parque urbano con senderos, praderas y espacios culturales que ofrece una pausa natural en el centro de Manhattan.", duration: "2–3 horas", price: "Gratuito", altitude: "30 m", reviewCount: 944 },
    { slug: "eiffel_tower", title: "Torre Eiffel", category: "Ciudad", location: "París, Francia", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1000&auto=format&fit=crop", description: "El icono de París ofrece vistas de la ciudad desde sus distintos niveles y una experiencia arquitectónica emblemática junto al Sena.", duration: "1–2 horas", price: "Desde €23", altitude: "330 m", reviewCount: 3256 },
    { slug: "playa_blanca", title: "Playa Blanca", category: "Playa", location: "Bolívar, Colombia", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop", description: "Una playa de arena clara y aguas cálidas en la isla de Barú, ideal para nadar, descansar y disfrutar el paisaje del Caribe colombiano.", duration: "Medio día", price: "Acceso con costo", altitude: "0 m", reviewCount: 738 },
    { slug: "parque_tayrona", title: "Parque Tayrona", category: "Naturaleza", location: "Magdalena, Colombia", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000&auto=format&fit=crop", description: "Un parque natural donde la Sierra Nevada se encuentra con el mar Caribe, con senderos entre bosque tropical, playas y vestigios arqueológicos.", duration: "Todo el día", price: "Entrada con costo", altitude: "0–900 m", reviewCount: 1164 },
    { slug: "piedra_del_penol", title: "Piedra del Peñol", category: "Montaña", location: "Antioquia, Colombia", rating: 4.8, imageUrl: "https://i.redd.it/y10vhdjst9901.jpg", description: "Un monolito de gran altura con una escalinata hasta el mirador, desde donde se observan las islas y embalses que rodean Guatapé.", duration: "2–3 horas", price: "Ascenso con costo", altitude: "2.135 m", reviewCount: 965 },
    { slug: "cano_cristales", title: "Caño Cristales", category: "Naturaleza", location: "Meta, Colombia", rating: 4.9, imageUrl: "https://i.pinimg.com/originals/8f/be/f6/8fbef6eca139d3513f7381c9416fea3e.jpg", description: "Un río reconocido por los colores estacionales de sus plantas acuáticas, rodeado por formaciones rocosas, cascadas y ecosistemas de la Serranía de la Macarena.", duration: "Todo el día", price: "Visita guiada", altitude: "200 m", reviewCount: 624 },
    { slug: "parque_guell", title: "Parque Güell", category: "Parque", location: "Barcelona, España", rating: 4.8, imageUrl: "https://cdn-imgix.headout.com/microbrands-content-image/image/e8be31fae465f686757c60e3ebc8d62f-barcelona%20park%20g%C3%BCell.jpg", description: "Parque Güell es uno de los lugares más emblemáticos de Barcelona, reconocido por la arquitectura de Antoni Gaudí, sus mosaicos coloridos y sus vistas de la ciudad.", duration: "2 - 3 horas", price: "Desde €18", altitude: "182 m", reviewCount: 1521 }
];

const initialReviews = [
    { placeSlug: "cerro_monserrate", name: "Valentina García", username: "valentina_garcia", date: "12 ago 2026", rating: 5, description: "La vista al atardecer es impresionante y el ascenso permite descubrir Bogotá desde otra perspectiva." },
    { placeSlug: "cartagena_amurallada", name: "Andrés Cano", username: "andres_cano", date: "15 ago 2026", rating: 5, description: "Las murallas, los balcones y las plazas hacen que cada recorrido se sienta distinto, especialmente al caer la tarde." },
    { placeSlug: "valle_del_cocora", name: "Valentina Cruz", username: "valentina_cruz", date: "Hace 3 días", rating: 5, description: "El circuito completo vale la pena: los paisajes cambian a cada paso y las palmas son impresionantes." },
    { placeSlug: "machu_picchu", name: "Valentina Cruz", username: "valentina_cruz", date: "Hace 3 días", rating: 5, description: "Una visita inolvidable. Llegar temprano permitió disfrutar el paisaje con calma y recorrer los principales sectores." }
];

export async function loadInitialPlaces() {
    for (const placeData of initialPlaces) {
        const existing = await Place.findOne({ where: { slug: placeData.slug } });
        if (existing) {
            await existing.update(placeData);
            continue;
        }

        const legacyTitle = placeData.slug === "cerro_monserrate" ? "Monserrate"
            : placeData.slug === "cartagena_amurallada" ? "Ciudad Amurallada"
                : placeData.slug === "valle_del_cocora" ? "Valle del Cocora" : null;
        const legacyPlace = legacyTitle ? await Place.findOne({ where: { title: legacyTitle, slug: null } }) : null;

        if (legacyPlace) {
            await legacyPlace.update(placeData);
        } else {
            await Place.create(placeData);
        }
    }

    for (const reviewData of initialReviews) {
        const place = await Place.findOne({ where: { slug: reviewData.placeSlug } });
        const email = `${reviewData.username}@preview.wayspot.local`;
        const [user] = await User.findOrCreate({
            where: { username: reviewData.username },
            defaults: { name: reviewData.name, username: reviewData.username, email, bio: null, location: null, avatarUrl: null }
        });
        const existingReview = await Review.findOne({
            where: { placeId: place.id, userId: user.id, description: reviewData.description }
        });

        if (!existingReview) {
            await Review.create({
                rating: reviewData.rating,
                title: "",
                description: reviewData.description,
                reviewDate: reviewData.date,
                userId: user.id,
                placeId: place.id
            });
        }
    }

    console.log("Initial places and preview reviews synchronized.");
}
