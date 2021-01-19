import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragment";
import { coockedOrders } from "../../__generated__/coockedOrders";
import { Link, useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ILocs {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className='text-lg'>🚖</div>;

export const Dashboard = () => {
  const [driverLocs, setDriverLocs] = useState<ILocs>({ lng: 0, lat: 0 });

  // state에 저장해서 계속 활용할 수 있게 하자
  const [map, setMap] = useState<google.maps.Map>();
  // const [maps, setMaps] = useState<any>();
  // 이미 구글맵 띄우는 순간 전역에 google 객체가 생기므로 Maps 저장할 필요가 없다

  useEffect(() => {
    const onSuccess = ({
      coords: { latitude, longitude },
    }: GeolocationPosition) => {
      setDriverLocs({ lat: latitude, lng: longitude });
    };

    const onError = (error: GeolocationPositionError) => {
      console.warn(error);
    };

    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    }); // watchPosition 은 실시간 위치 계속 전달해 준다
    if (map && google.maps) {
      map.panTo(new google.maps.LatLng(driverLocs.lat, driverLocs.lng));
    }
  }, [driverLocs.lat, driverLocs.lng]);

  useEffect(() => {});

  const onApiLoaded = ({ map }: { map: google.maps.Map }) => {
    // map 은 내가 가지고 있는 지도의 인스턴스
    // maps는 구글 맵 api
    map.panTo(new google.maps.LatLng(driverLocs.lat, driverLocs.lng));
    // 구글 API로 새주소 만들어서 내 지도 인스턴스에서 이동

    setMap(map);
    // setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          // 경로 표시선 모양 변경가능
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });

      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: {
            // 시작
            location: new google.maps.LatLng(driverLocs.lat, driverLocs.lng),
          },
          destination: {
            // 목적지
            location: new google.maps.LatLng(
              driverLocs.lat + 0.05,
              driverLocs.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const { data: coockedOrdersData } = useSubscription<coockedOrders>(
    COOCKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (coockedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [coockedOrdersData]);

  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${coockedOrdersData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    }
  );
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  return (
    <div>
      <div
        className='overflow-hidden'
        style={{ width: window.innerWidth, height: "50vh" }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          // 내가 가지고 있는 지도를 조작 하려면 위에 두개 활성화
          defaultZoom={16}
          defaultCenter={{ lat: 37, lng: 127 }}
          bootstrapURLKeys={{
            key: "AIzaSyAqYbp6ubZYl34Q4N5iIWtI7UyxlYOBtIw",
          }}>
          {/* <Driver lat={driverLocs.lat} lng={driverLocs.lng} /> */}
          {/* 크롬 sensors옵션가면 location 변경해서 위치 변하는거 확인가능 */}
        </GoogleMapReact>
      </div>
      <div className=' max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5'>
        {coockedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className='text-center  text-3xl font-medium'>
              New Coocked Order
            </h1>
            <h1 className='text-center my-3 text-2xl font-medium'>
              Pick it up soon @{" "}
              {coockedOrdersData?.cookedOrders.restaurant?.name}
            </h1>
            <button
              onClick={() =>
                triggerMutation(coockedOrdersData?.cookedOrders.id)
              }
              className='btn w-full  block  text-center mt-5'>
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className='text-center  text-3xl font-medium'>
            No orders yet...
          </h1>
        )}
      </div>
    </div>
  );
};
