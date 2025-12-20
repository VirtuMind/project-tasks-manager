const Footer = () => {
  return (
    <footer className="border-t-2 border-foreground bg-card py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://khoubaz.com"
            className="font-bold text-foreground underline underline-offset-2 hover:text-foreground/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            Younes Khoubaz
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
