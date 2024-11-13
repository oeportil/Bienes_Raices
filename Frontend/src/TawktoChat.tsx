import { useEffect } from "react";

const TawktoChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/67342db22480f5b4f59d0d7b/1icht50ov";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.onload = () => {
      console.log("Tawk.to script loaded successfully");
    };
    document.head.appendChild(script);
  }, []);

  return null;
};
export default TawktoChat;
