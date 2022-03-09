export default function Logo({ small, icon }: { small?: boolean; icon?: boolean }) {
  return (
    <h1 className="inline">
      <strong>
        {icon ? (
          <img className="mx-auto w-9" alt="elKaribu" title="elKaribu" src="/elkaribu-icon-white.svg" />
        ) : (
          <img
            className={small ? "h-4 w-auto" : "h-5 w-auto"}
            alt="elKaribu"
            title="elKaribu"
            src="/elkaribu-logo-word-white.svg"
          />
        )}
      </strong>
    </h1>
  );
}
