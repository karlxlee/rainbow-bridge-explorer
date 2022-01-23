import Page from "@/components/Page";
import 

export default function Transaction(props) {


}

export async function getServerSideProps({ params }) {
  const { tx, error } = await transactions(params.address);
  return {
    props: {
      address: params.address,
      tx,
      error,
    }, 
  };
}
