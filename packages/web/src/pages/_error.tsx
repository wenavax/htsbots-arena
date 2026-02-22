function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px", background: "#0A0A0F", color: "#ccc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "48px", color: "#39FF14", fontFamily: "monospace" }}>
        {statusCode || "Error"}
      </h1>
      <p style={{ fontFamily: "monospace", marginTop: "20px" }}>
        {statusCode === 404 ? "Page not found" : "An error occurred"}
      </p>
      <a href="/" style={{ color: "#00FFFF", fontFamily: "monospace", marginTop: "20px", display: "inline-block" }}>
        {"<< Back to Home"}
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
