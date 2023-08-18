import squidBlack from "../Assets/squid-black.png"
import squidWhite from "../Assets/squid-white.png"

export default function Footer({darkMode}) {
    return (
        <footer>
            <p>© CalicoSquid Code 2023</p>
            <img src={darkMode ? squidWhite : squidBlack} alt="my cat squid"/>
        </footer>
    )
}