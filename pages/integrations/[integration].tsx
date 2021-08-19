import Head from "next/head";
import prisma from "../../lib/prisma";
import { getIntegrationName, getIntegrationType } from "../../lib/integrations";
import Shell from "../../components/Shell";
import { useState } from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import Loader from "@components/Loader";

export default function Integration(props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, loading] = useSession();

  const [showAPIKey, setShowAPIKey] = useState(false);

  if (loading) {
    return <Loader />;
  }

  function toggleShowAPIKey() {
    setShowAPIKey(!showAPIKey);
  }

  async function deleteIntegrationHandler(event) {
    event.preventDefault();

    /*eslint-disable */
    const response = await fetch("/api/integrations", {
      method: "DELETE",
      body: JSON.stringify({ id: props.integration.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    /*eslint-enable */

    router.push("/integrations");
  }

  return (
    <div>
      <Head>
        <title>{getIntegrationName(props.integration.type)} App | Calendso</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Shell heading={getIntegrationName(props.integration.type)} subtitle="Manage and delete this app.">
        <div className="block gap-4 grid-cols-3 sm:grid">
          <div className="col-span-2 mb-6 bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-gray-900 text-lg font-medium leading-6">Integration Details</h3>
              <p className="mt-1 max-w-2xl text-gray-500 text-sm">
                Information about your {getIntegrationName(props.integration.type)} App.
              </p>
            </div>
            <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
              <dl className="grid gap-y-8">
                <div>
                  <dt className="text-gray-500 text-sm font-medium">App name</dt>
                  <dd className="mt-1 text-gray-900 text-sm">{getIntegrationName(props.integration.type)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-sm font-medium">App Category</dt>
                  <dd className="mt-1 text-gray-900 text-sm">{getIntegrationType(props.integration.type)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-sm font-medium">API Key</dt>
                  <dd className="mt-1 text-gray-900 text-sm">
                    {!showAPIKey ? (
                      <span>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
                    ) : (
                      <div>
                        <textarea
                          name="apikey"
                          rows={6}
                          className="block w-full border-gray-300 focus:border-neutral-500 rounded-sm shadow-sm focus:ring-neutral-500 sm:text-sm"
                          readOnly>
                          {JSON.stringify(props.integration.key)}
                        </textarea>
                      </div>
                    )}
                    <button
                      onClick={toggleShowAPIKey}
                      className="ml-2 hover:text-neutral-700 text-neutral-900 font-medium">
                      {!showAPIKey ? "Show" : "Hide"}
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div>
            <div className="mb-6 bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-gray-900 text-lg font-medium leading-6">Delete this app</h3>
                <div className="mt-2 max-w-xl text-gray-500 text-sm">
                  <p>Once you delete this app, it will be permanently removed.</p>
                </div>
                <div className="mt-5">
                  <button
                    onClick={deleteIntegrationHandler}
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 text-red-700 font-medium bg-red-100 hover:bg-red-200 border border-transparent rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm">
                    Delete App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </div>
  );
}

export async function getServerSideProps(context) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await getSession(context);

  const integration = await prisma.credential.findFirst({
    where: {
      id: parseInt(context.query.integration),
    },
    select: {
      id: true,
      type: true,
      key: true,
    },
  });
  return {
    props: { integration }, // will be passed to the page component as props
  };
}
