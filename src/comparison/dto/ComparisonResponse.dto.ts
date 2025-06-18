export class ComparisonResponse {
  feedback_position: string;
  feedback_angular: string;
  feedback_acel_vel: string;
  values_position: ValuesResponse;
  values_angular: ValuesResponse;
  values_acel_vel: ValuesResponse;
  data_full_user_one: UserDataFullResponse;
  data_full_user_two: UserDataFullResponse;
}

class ValuesResponse {
  'Articulación Atlanto-Occipital y Atlanto-Axial (AO-AA)': JointInformationResponse[];
  'Columna Cervical': JointInformationResponse[];
  'Columna Torácica y Lumbar': JointInformationResponse[];
  'Articulación Sacroilíaca': JointInformationResponse[];
  'Cadera Izquierda (Coxofemoral)': JointInformationResponse[];
  'Cadera Derecha (Coxofemoral)': JointInformationResponse[];
  'Rodilla Izquierda': JointInformationResponse[];
  'Rodilla Derecha': JointInformationResponse[];
  'Tobillo Izquierdo (Art. Talocrural)': JointInformationResponse[];
  'Tobillo Derecho (Art. Talocrural)': JointInformationResponse[];
  'Articulaciones del Pie Izquierdo (Subtalar y MTF)': JointInformationResponse[];
  'Articulaciones del Pie Derecho (Subtalar y MTF)': JointInformationResponse[];
  'Articulación Esternoclavicular': JointInformationResponse[];
  'Articulación Acromioclavicular': JointInformationResponse[];
  'Articulación Escapulotorácica': JointInformationResponse[];
  'Hombro Izquierdo (Glenohumeral)': JointInformationResponse[];
  'Hombro Derecho (Glenohumeral)': JointInformationResponse[];
  'Codo Izquierdo': JointInformationResponse[];
  'Codo Derecho': JointInformationResponse[];
  'Muñeca Izquierda': JointInformationResponse[];
  'Muñeca Derecha': JointInformationResponse[];
}

class JointInformationResponse {
  label: string;
  s_inicio: number;
  s_final: number;
}

class UserDataFullResponse {
  info: UserDataInfoResponse;
  data: UserDataJoints;
}

class UserDataInfoResponse {
  frames: number[];
  ms: number[];
}

class UserDataJoints {
  'Articulación Atlanto-Occipital y Atlanto-Axial (AO-AA)': MovementDataResponse;
  'Columna Cervical': MovementDataResponse;
  'Columna Torácica y Lumbar': MovementDataResponse;
  'Articulación Sacroilíaca': MovementDataResponse;
  'Cadera Izquierda (Coxofemoral)': MovementDataResponse;
  'Cadera Derecha (Coxofemoral)': MovementDataResponse;
  'Rodilla Izquierda': MovementDataResponse;
  'Rodilla Derecha': MovementDataResponse;
  'Tobillo Izquierdo (Art. Talocrural)': MovementDataResponse;
  'Tobillo Derecho (Art. Talocrural)': MovementDataResponse;
  'Articulaciones del Pie Izquierdo (Subtalar y MTF)': MovementDataResponse;
  'Articulaciones del Pie Derecho (Subtalar y MTF)': MovementDataResponse;
  'Articulación Esternoclavicular': MovementDataResponse;
  'Articulación Acromioclavicular': MovementDataResponse;
  'Articulación Escapulotorácica': MovementDataResponse;
  'Hombro Izquierdo (Glenohumeral)': MovementDataResponse;
  'Hombro Derecho (Glenohumeral)': MovementDataResponse;
  'Codo Izquierdo': MovementDataResponse;
  'Codo Derecho': MovementDataResponse;
  'Muñeca Izquierda': MovementDataResponse;
  'Muñeca Derecha': MovementDataResponse;
}

export interface MovementDataResponse {
  x: number[];
  y: number[];
  z: number[];
  xrot: number[];
  yrot: number[];
  zrot: number[];
  wrot: number[];
}
